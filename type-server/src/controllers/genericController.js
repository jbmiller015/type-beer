const collectParam = require("../middlewares/collectParam");
const mongoose = require("mongoose");
const createModel = collectParam.createModel;

exports.generic_get = async (req, res) => {
    const base = toUpper(req.params.base);
    const Object = mongoose.model(base);
    const {id, name} = req.query;
    let getRes;
    console.log("url: " + req.url)
    console.log("req.query: " + id, name)
    console.log("req.user._id: " + req.user._id)

    if (id) {
        getRes = await Object.find({_id: id, userId: req.user._id}).exec();
    } else if (name)
        getRes = await Object.find({name: {$regex: name, $options: 'i'}, userId: req.user._id});
    else {
        getRes = await Object.find({userId: req.user._id}).exec();
    }

    return res.status(200).json(getRes);
}


exports.generic_post = async (req, res) => {
    const base = toUpper(req.params.base);
    const Object = mongoose.model(base);
    try {
        const object = new Object(createModel(base, req));
        await object.save();
        res.send(object);
    } catch (e) {
        res.status(422).send(e.message);
    }
}

exports.generic_sub_get = async (req, res) => {
    if (req.url !== '/process/active') {
        let Object;
        let getRes;
        const base = toUpper(req.params.base);
        if (req.params.sub.length === 24) {
            Object = mongoose.model(base);
            getRes = await Object.find({userId: req.user._id, _id: req.params.sub});
        } else {
            Object = mongoose.model(req.params.sub);
            getRes = await Object.find({userId: req.user._id});
        }
        res.send(getRes);
    }
}

exports.generic_sub_post = async (req, res) => {
    const sub = req.params.sub;
    const Object = mongoose.model(sub);
    try {
        const object = new Object(createModel(sub, req));
        await object.save();
        res.send(object);
    } catch (e) {
        res.status(422).send(e.message);
    }
}

exports.generic_sub_put = async (req, res) => {
    const base = toUpper(req.params.base);
    const _id = req.params.sub;
    const Object = mongoose.model(base);
    try {
        await Object.findOneAndUpdate({_id}, createModel(base, req), {upsert: true, useFindAndModify: false});
        res.send(req.body);
    } catch (e) {
        res.status(422).send(e.message);
    }
}

exports.generic_sub_delete = async (req, res) => {
    const base = toUpper(req.params.base);
    const _id = req.params.sub;
    const Object = mongoose.model(base);
    try {
        await Object.findOneAndDelete({_id}, {useFindAndModify: false});
        res.send({deleted: _id});

    } catch (e) {
        res.status(422).send(e.message);
    }
}

exports.generic_sub_ref_get = async (req, res) => {
    res.send('NOT IMPLEMENTED: Generic Sub Ref GET');
}

exports.generic_sub_ref_post = async (req, res) => {
    res.send('NOT IMPLEMENTED: Generic Sub Ref POST');
}

exports.generic_sub_ref_put = async (req, res) => {
    const _id = req.params.ref;
    const sub = req.params.sub;
    const Object = mongoose.model(sub);
    try {
        await Object.findOneAndUpdate({_id}, createModel(sub, req), {upsert: true, useFindAndModify: false});
        res.send(req.body);
    } catch (e) {
        res.status(422).send(e.message);
    }
}

exports.generic_sub_ref_delete = async (req, res) => {
    const _id = req.params.ref;
    const Object = mongoose.model(req.params.sub);
    try {
        await Object.findOneAndDelete({_id}, {useFindAndModify: false});
        res.send({deleted: _id});
    } catch (e) {
        res.status(422).send(e.message);
    }
}

const toUpper = (base) => {
    return base.charAt(0).toUpperCase() + base.slice(1);
}

const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const collectParam = require('../middlewares/collectParam');
const createModel = collectParam.createModel;

const router = express.Router();

//Active: Requires authorization.
router.use(requireAuth);

router.route('/:base').get(async (req, res) => {
    const base = toUpper(req.params.base);
    const Object = mongoose.model(base);
    const {name} = req.query;
    let getRes;

    if (name)
        getRes = await Object.find({name: {$regex: name, $options: 'i'}, userId: req.user._id});
    else
        getRes = await Object.find({userId: req.user._id});

    res.send(getRes);
}).post(async (req, res) => {
    console.log(req.body)
    console.log(req.user)
    const base = toUpper(req.params.base);
    const Object = mongoose.model(base);
    try {
        const object = new Object(createModel(base, req));
        await object.save();
        res.send(object);
    } catch (e) {
        res.status(422).send(e.message);
    }
});

router.route('/:base/:sub').get(async (req, res) => {
    const Object = mongoose.model(req.params.sub);
    const getRes = await Object.find({userId: req.user._id});
    res.send(getRes);
}).post(async (req, res) => {
    const sub = req.params.sub;
    const Object = mongoose.model(sub);
    try {
        const object = new Object(createModel(sub, req));
        await object.save();
        res.send(object);
    } catch (e) {
        res.status(422).send(e.message);
    }
}).put(async (req, res) => {
    const base = toUpper(req.params.base);
    const _id = req.params.sub;
    const Object = mongoose.model(base);
    try {
        await Object.findOneAndUpdate({_id}, createModel(base, req), {upsert: true, useFindAndModify: false});
        res.send(req.body);
    } catch (e) {
        res.status(422).send(e.message);
    }
}).delete(async (req, res) => {
    const base = toUpper(req.params.base);
    const _id = req.params.sub;
    const Object = mongoose.model(base);
    try {
        await Object.findOneAndDelete({_id}, {useFindAndModify: false});
        res.send({deleted: _id});
    } catch (e) {
        res.status(422).send(e.message);
    }
});

router.route('/:base/:sub/:ref').put(async (req, res) => {
    const _id = req.params.ref;
    const sub = req.params.sub;
    const Object = mongoose.model(sub);
    try {
        await Object.findOneAndUpdate({_id}, createModel(sub, req), {upsert: true, useFindAndModify: false});
        res.send(req.body);
    } catch (e) {
        res.status(422).send(e.message);
    }
}).delete(async (req, res) => {
    const _id = req.params.ref;
    const Object = mongoose.model(req.params.sub);
    try {
        await Object.findOneAndDelete({_id}, {useFindAndModify: false});
        res.send({deleted: _id});
    } catch (e) {
        res.status(422).send(e.message);
    }
});

module.exports = router;


const toUpper = (base) => {
    return base.charAt(0).toUpperCase() + base.slice(1);
}

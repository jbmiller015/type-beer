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
    const getRes = await Object.find({userId: req.user._id});
    res.send(getRes);
}).post(async (req, res) => {
    const base = toUpper(req.params.base);
    const Object = mongoose.model(base);
    try {
        const object = new Object(createModel(base, req));
        await object.save();
        res.send(object);
    } catch (e) {
        res.status(422).send({error: e.message});
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
        res.status(422).send({error: e.message});
    }
}).put(async (req, res) => {
    const _id = req.params.sub;
    const base = req.params.base;
    const Object = mongoose.model(base);
    try {
        await Object.findOneAndUpdate({_id}, createModel(base, req), {upsert: true});
        res.send(req.body);
    } catch (e) {
        res.status(422).send({error: e.message});
    }
}).delete(async (req, res) => {
    const _id = req.params.sub;
    const Object = mongoose.model(req.params.base);
    try {
        await Object.findOneAndDelete({_id});
        res.send({deleted: _id});
    } catch (e) {
        res.status(422).send({error: e.message});
    }
});

router.route('/:base/:sub/:ref').put(async (req, res) => {
    const _id = req.params.ref;
    const sub = req.params.sub;
    const Object = mongoose.model(sub);
    try {
        await Object.findOneAndUpdate({_id}, createModel(sub, req), {upsert: true});
        res.send(req.body);
    } catch (e) {
        res.status(422).send({error: e.message});
    }
}).delete(async (req, res) => {
    const _id = req.params.ref;
    const Object = mongoose.model(req.params.sub);
    try {
        await Object.findOneAndDelete({_id});
        res.send({deleted: _id});
    } catch (e) {
        res.status(422).send({error: e.message});
    }
});

module.exports = router;


const toUpper = (base)=>{
    return base.charAt(0).toUpperCase() + base.slice(1);
}

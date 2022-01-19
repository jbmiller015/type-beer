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
    const {id, name, fill} = req.query;
    let getRes;

    if (id)
        getRes = await Object.find({_id: id, userId: req.user._id});
    else if (name)
        getRes = await Object.find({name: {$regex: name, $options: 'i'}, userId: req.user._id, fill});
    else
        getRes = await Object.find({userId: req.user._id});

    res.send(getRes);
}).post(async (req, res) => {
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
    let Object;
    let getRes;
    const {startDate, endDate, name} = req.query;
    const base = toUpper(req.params.base);
    if (req.params.sub.length === 24) {
        Object = mongoose.model(base);
        getRes = await Object.find({userId: req.user._id, _id: req.params.sub});
    } else if (req.params.sub === 'active') {
        const today = new Date();
        Object = mongoose.model(base);
        if (startDate && endDate) {
            getRes = await Object.find({
                userId: req.user._id,
                startDate: {$lte: new Date(startDate)},
                endDate: {$lte: new Date(endDate), $gte: new Date(startDate)}
            });
            for (let el of await Object.find({
                userId: req.user._id,
                startDate: {$gte: new Date(startDate), $lte: new Date(endDate)},
                endDate: {$gte: new Date(endDate)}
            })) {
                getRes.push(el);
            }
            let tankList = [];
            for (let el of getRes) {
                for (let le of el.phases) {
                    const {startTank, endTank} = le;
                    if (startTank.toString() === endTank.toString() && tankList.indexOf(startTank.toString()) === -1) {
                        tankList.push(startTank.toString());
                    } else {
                        if (tankList.indexOf(startTank.toString()) === -1)
                            tankList.push(startTank.toString());
                        if (tankList.indexOf(endTank.toString()) === -1)
                            tankList.push(endTank.toString());
                    }
                }
            }
            let tanks = await mongoose.model('Tank').find({userId: req.user._id, name: {$regex: name, $options: 'i'}})
            getRes = tanks.filter(tank => {
                return tankList.indexOf(tank._id.toString()) === -1
            });
        } else {
            getRes = await Object.find({
                userId: req.user._id,
                startDate: {$lte: today},
                endDate: {$gte: today}
            });
        }
        if (getRes.length > 0) {
            for (let i = 0; i < getRes.length; i++) {
                for (let le of getRes[i].phases) {
                    if (le.startDate <= today && le.endDate >= today) {
                        getRes[i].activePhase = le;
                    }
                }
            }
        }
    } else {
        Object = mongoose.model(req.params.sub);
        getRes = await Object.find({userId: req.user._id});
    }
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

const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Process = mongoose.model('Process');

const router = express.Router();

//Active: Requires authorization.
router.use(requireAuth);


router.get('/process', async (req, res) => {
    const tanks = await Process.find({userId: req.user._id});
    res.send(tanks);
});

router.post('/process', async (req, res) => {
    const {name, size, beer, fill, fillDate, action, actionDate, clean, cleanDate} = req.body;
    if (!name || !size)
        return res.status(422).send({error: 'You must provide a name and size'});
    try {
        const tank = new Process({
            name,
            size,
            beer,
            fill,
            fillDate,
            action,
            actionDate,
            clean,
            cleanDate,
            userId: req.user._id
        });
        await tank.save();
        res.send(tank);
    } catch (e) {
        res.status(422).send({error: e.message});
    }
});

router.get('/tanks/:_id', async (req, res) => {
    const tankId = req.params._id;
    const tank = await Process.find({_id: tankId});
    res.send(tank);
});

router.put('/tanks/:_id', async (req, res) => {
    const tankId = req.params._id;
    const {name, size, beer, fill, fillDate, action, actionDate, clean, cleanDate} = req.body;
    try {
        await Process.findOneAndUpdate({_id: tankId}, {
            name,
            size,
            beer,
            fill,
            fillDate,
            action,
            actionDate,
            clean,
            cleanDate,
            userId: req.user._id
        }, {upsert: true});
        res.send(req.body);
    } catch (e) {
        res.status(422).send({error: e.message});
    }
});

router.delete('/tanks/:_id', async (req, res) => {
    const tankId = req.params._id;
    try {
        await Process.findOneAndDelete({_id: tankId});
        res.send({deleted: tankId});
    } catch (e) {
        res.status(422).send({error: e.message});
    }
});


module.exports = router;

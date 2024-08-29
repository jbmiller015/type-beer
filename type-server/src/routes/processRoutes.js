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

module.exports = router;

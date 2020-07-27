const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Beer = mongoose.model('Beer');

const router = express.Router();

//Use once authorization is needed
router.use(requireAuth);

router.get('/beers', async (req, res) => {
    const beers = await Beer.find({userId: req.user._id});
    res.send(beers);
});

router.post('/beers', async (req, res) => {
    const {name, style, pic, desc} = req.body;
    if (!name || !style)
        return res.status(422).send({error: 'You must provide a name and style'});
    try {
        const beer = new Beer({name, style, pic, desc, userId: req.user._id});
        await beer.save();
        res.send(beer);
    } catch (e) {
        res.status(422).send({error: e.message});
    }
});

router.put('/beers/:_id', async (req, res) => {
    const bid = req.params._id;
    const {name, style, pic, desc} = req.body;
    try {
        await Beer.findOneAndUpdate({_id: bid}, {
            name,
            style,
            pic,
            desc,
            userId: req.user._id
        }, {upsert: true});
        res.send(req.body);
    } catch (e) {
        res.status(422).send({error: e.message});
    }
});

router.delete('/beers/:_id', async (req, res) => {
    const bid = req.params._id;
    try {
        await Beer.findOneAndDelete({_id: bid});
        res.send({deleted: bid});
    } catch (e) {
        res.status(422).send({error: e.message});
    }
});

module.exports = router;
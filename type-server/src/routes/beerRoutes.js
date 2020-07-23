const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Beer = mongoose.model('Beer');

const router = express.Router();

//Use once authorization is needed
router.use(requireAuth);

router.get('/beers', async (req, res) => {
    const beers = await Beer.find({breweryId: req.user._id});
    res.send(beers);
});

router.post('/beers', async (req, res) => {
    console.log(req.body);
    const {name, style, pic, desc} = req.body;
    if (!name || !style)
        return res.status(422).send({error: 'You must provide a name and style'});
    try {
        const beer = new Beer({name, style, pic, desc, breweryId: req.user._id});
        await beer.save();
        res.send(beer);
    } catch (e) {
        res.status(422).send({error: e.message});
    }
});

module.exports = router;
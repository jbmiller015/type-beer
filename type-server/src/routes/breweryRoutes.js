const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Brewery = mongoose.model('Brewery');

const router = express.Router();

router.use(requireAuth);

router.get('/brewery', async (req, res) => {
    const brewery = await Brewery.find({userId: req.user._id});
    res.send(brewery);
});

router.post('/brewery', async (req, res) => {
    const {name, address, logo_pic} = req.body;
    if (!name || !address)
        return res.status(422).send({error: 'You must provide a name and address'});
    try {
        const brewery = new Brewery({userId: req.user._id, name, address, logo_pic});
        await brewery.save();
        res.send(brewery);
    } catch (e) {
        res.status(422).send({error: e.message});
    }
});

router.put('/brewery/:_id', async (req, res) => {
    const breweryId = req.params._id;
    const {name,} = req.body;

    try {
        await Brewery.findOneAndUpdate({_id: breweryId}, {
            name,
            address,
            logo_pic,
            userId: req.user._id
        }, {upsert: true});
        res.send(req.body);
    } catch (e) {
        res.status(422).send({error: e.message});
    }
});

router.delete('/brewery/:_id', async (req, res) => {
    const breweryId = req.params._id;
    try {
        await Brewery.findOneAndDelete({_id: breweryId});
        res.send({deleted: beerId});
    } catch (e) {
        res.status(422).send({error: e.message});
    }
});

module.exports = router;
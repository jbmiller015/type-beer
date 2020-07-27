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

module.exports = router;
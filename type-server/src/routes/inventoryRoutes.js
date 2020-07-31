const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Hop = mongoose.model('Hop');
const Addition = mongoose.model('Addition');
const MaltGrain = mongoose.model('MaltGrain');
const Yeast = mongoose.model('Yeast');

const router = express.Router();

//Active: Requires authorization.
router.use(requireAuth);

router.route('inventory/hops').get(async (req, res) => {

}).post(async (req, res) => {

});

module.exports = router;
const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Hop = mongoose.model('hop');
const Addition = mongoose.model('addition');
const MaltGrain = mongoose.model('maltGrain');
const Yeast = mongoose.model('yeast');

const router = express.Router();

//Active: Requires authorization.
router.use(requireAuth);

router.route('inventory/hops').get(async (req, res) => {

}).post(async (req, res) => {

});

router.route('inventory/maltsgrains').get(async (req, res) => {

}).post(async (req, res) => {

});

router.route('inventory/yeasts').get(async (req, res) => {

}).post(async (req, res) => {

});

router.route('inventory/additions').get(async (req, res) => {

}).post(async (req, res) => {

});


module.exports = router;

const mongoose = require('mongoose');

const yeastSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    yeastType: String,
    name: {
        required: true,
        type: String
    },
    supplier: String,
    characteristics: String,
    quantity: Number,
    pitching: String,
    fermentationTempLow: Number,
    fermentationTempHigh: Number,
    attenuationLow: Number,
    attenuationHigh: Number,
    alcoholToleranceLow: Number,
    alcoholToleranceHigh: Number,
    flocculation: String
});

mongoose.model('Yeast',yeastSchema);

const mongoose = require('mongoose');

const hopSchema = new mongoose.Schema({
    hopType: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    supplier: String,
    harvestDate: Date,
    alphaAcid: String,
    quantity: Number,
    expirationDate: Date,
    note: String
});
const maltGrainSchema = new mongoose.Schema({
    maltGrainType: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    color: String,
    supplier: String,
    lovibond: Number,
    moisturePercent: Number,
    grainUsage: Number,
    diastaticPowderLow: Number,
    diastaticPowderHigh: Number,
    quantity: Number,
    expirationDate: Date,
    note: String

});
const additionSchema = new mongoose.Schema({
    additionType: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    quantity: Number,
    note: String,
    supplier: String,
    expirationDate: Date,
});
const yeastSchema = new mongoose.Schema({
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
const recipeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    BatchSize: {
        required: true,
        type: String
    },
    units: {
        required: true,
        type: String
    },
    og: Number,
    fg: Number,
    ibu: Number,
    srm: Number,
    abv: Number,
    maltGrain: [maltGrainSchema],
    hop: [hopSchema],
    addition: [additionSchema],
    yeast: [yeastSchema],
    brewStyle: String,
    boilSize: Number,
    boilTime: Number,
    directions: String,
    brewersNotes: String,
    brewDate: Date,
    efficiency: Number
});

mongoose.model('Recipe', recipeSchema);
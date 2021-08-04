const mongoose = require('mongoose');

const maltGrainSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
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

mongoose.model('MaltGrain', maltGrainSchema);

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

mongoose.model('Hop', hopSchema);
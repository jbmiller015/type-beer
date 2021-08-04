const mongoose = require('mongoose');

const additionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
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

mongoose.model('Addition', additionSchema);

const mongoose = require('mongoose');
const Beer = mongoose.model('Beer');
const Schema = mongoose.Schema;
const beerSchema = require('./Beer');

const tankSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true
    },
    tankType: {
        type: String,
        required: true,
    },
    contents: {
        type: Schema.Types.ObjectId,
        ref: 'Beer'
    },
    fill: {
        type: Boolean,
        required: false
    },
    fillDate: {
        type: Date,
        required: false
    }
});

mongoose.model('Tank', tankSchema);

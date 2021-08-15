const mongoose = require('mongoose');
const Beer = mongoose.model('Beer');
//const Customer = mongoose.model('Customer');
const Schema = mongoose.Schema;

const tankSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    beer: {
        type: Schema.Types.ObjectId,
        ref: 'Beer',
        required: false
    },
    fill: {
        type: Boolean,
        required: false
    },
    fillDate: {
        type: Date,
        required: false
    },
    currPhase: {
        type: String,
        required: false
    },
    currPhaseDate: {
        type: Date,
        required: false
    },
    nextPhase : {
        type: String,
        required: false
    }
});

mongoose.model('Tank', tankSchema);

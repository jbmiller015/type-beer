const mongoose = require('mongoose');
const Beer = mongoose.model('Beer');
const Tank = mongoose.model('Tank');
const Schema = mongoose.Schema;
const beerSchema = require('./Beer');
const tankSchema = require('./Tank');

const processSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
    },
    expectedYield: {
        type: String,
        required: false
    },
    actualYield: {
        type: String,
        required: false
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    contents: {
        type: Schema.Types.ObjectId,
        ref: 'Beer'
    },
    phases: [{
        phaseName: String,
        startTank: {
            type: Schema.Types.ObjectId,
            ref: 'Tank'
        },
        endTank: {
            type: Schema.Types.ObjectId,
            ref: 'Tank'
        },
        startDate: Date,
        endDate: Date,
        complete: Boolean
    }],
    activePhase: {
        phaseName: String,
        startTank: {
            type: Schema.Types.ObjectId,
            ref: 'Tank'
        },
        endTank: {
            type: Schema.Types.ObjectId,
            ref: 'Tank'
        },
        startDate: Date,
        endDate: Date,
        complete: Boolean
    }
});

mongoose.model('Process', processSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//TODO: use clibpboard-text-outline from vector-icons as recipe icon.

const recipeSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
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
    maltGrain: [{
        type: Schema.Types.ObjectId,
        ref: 'MaltGrain'
    }],
    hop: [{
        type: Schema.Types.ObjectId,
        ref: 'Hop'
    }],
    addition: [{
        type: Schema.Types.ObjectId,
        ref: 'Addition'
    }],
    yeast: [{
        type: Schema.Types.ObjectId,
        ref: 'Yeast'
    }],
    og: Number,
    fg: Number,
    ibu: Number,
    srm: Number,
    abv: Number,
    brewStyle: String,
    boilSize: Number,
    boilTime: Number,
    directions: String,
    brewersNotes: String,
    brewDate: Date,
    efficiency: Number
});

mongoose.model('recipe', recipeSchema);
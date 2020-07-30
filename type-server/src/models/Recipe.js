const mongoose = require('mongoose');
const MaltGrain = mongoose.model('MaltGrain');
const Hop = mongoose.model('Hop');
const Addition = mongoose.model('Addition');
const Yeast = mongoose.model('Yeast');


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
    maltGrain: [MaltGrain],
    hop: [Hop],
    addition: [Addition],
    yeast: [Yeast],
    brewStyle: String,
    boilSize: Number,
    boilTime: Number,
    directions: String,
    brewersNotes: String,
    brewDate: Date,
    efficiency: Number
});

mongoose.model('Recipe', recipeSchema);
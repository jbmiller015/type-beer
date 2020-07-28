const mongoose = require('mongoose');

const beerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    breweryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brewery'
    },
    name: {
        type: String,
        required: true
    },
    style: {
        type: String,
        required: true
    },
    pic: {
        data: Buffer,
        contentType: String
    },
    desc: String
});

mongoose.model('Beer', beerSchema);

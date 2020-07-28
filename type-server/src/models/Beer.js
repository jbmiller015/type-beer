const mongoose = require('mongoose');

const beerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

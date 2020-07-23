const mongoose = require('mongoose');

const beer = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    style:{
        type: String,
        required: true
    },
    picture: {
        data:Buffer,
        contentType: String
    },
    description:String
})

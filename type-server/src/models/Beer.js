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
    pic: {
        data:Buffer,
        contentType: String
    },
    desc:String
})

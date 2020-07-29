const mongoose = require('mongoose');
const Beer = mongoose.model('Beer');
const Customer = mongoose.model('Customer');

const kegSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    size: {
        type: String,
        required: true
    },
    beer: {
        Beer,
        required: true
    },
    fillDate: {
        Date,
        required:true
    },
    clean:{
        type:Boolean,
        required:true
    },
    cleanDate: {
        Date,
        required:true
    },
    customer: Customer,
    pickupDate: Date,
    returnDate: Date,
    returnType: String,
});

mongoose.model('Keg', kegSchema);

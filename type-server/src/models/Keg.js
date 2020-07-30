const mongoose = require('mongoose');
const Beer = mongoose.model('Beer');
const Customer = mongoose.model('Customer');
const Schema = mongoose.Schema;

const kegSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    size: {
        type: String,
        required: true
    },
    beer: {
        type: Schema.Types.ObjectId,
        ref: 'Beer',
        required: true
    },
    fillDate: {
        Date,
        required: true
    },
    clean: {
        type: Boolean,
        required: true
    },
    cleanDate: {
        Date,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    pickupDate: Date,
    returnDate: Date,
    returnType: String,
});

mongoose.model('Keg', kegSchema);

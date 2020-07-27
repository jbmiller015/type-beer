const mongoose = require('mongoose');

const brewerySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: Object,
        required: true,
        properties: {
            address1: {
                title: "Address 1",
                type: String
            },
            address2: {
                title: "Address 2",
                type: String
            },
            address3: {
                title: "Address 3",
                type: String
            },
            region: {
                title: "State",
                type: String
            },
            locale: {
                title: "City",
                type: String
            },
            postalCode: {
                title: "Zip Code",
                type: String
            },
            required: [
                "address1",
                "region",
                "locale",
                "postalCode"
            ]
        }
    },
    logo_pic: {
        data: Buffer,
        contentType: String
    }
});

mongoose.model('Brewery', brewerySchema);
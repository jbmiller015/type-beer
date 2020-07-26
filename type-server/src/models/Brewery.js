const mongoose = require('mongoose');

const brewerySchema = new mongoose.Schema({
    breweryId: {
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
        properties:{
            "address1": {
                "title": "Address 1",
                "pattern": "^\\d+\\s[A-z0-9]+\\s[A-z]+\\s*[A-z]*$",
                "type": "string"
            },
            "address2": {
                "title": "Address 2",
                "pattern": "^[A-z]+\\s[A-z0-9\\-]+[\\s[0-9]+]*$",
                "type": "string"
            },
            "address3": {
                "title": "Address 3",
                "pattern": "^$", // empty string
                "type": "string"
            },
            "region": {
                "title": "State",
                "pattern": "^[A-z]+$",
                "type": "string"
            },
            "locale": {
                "title": "City",
                "pattern": "^[A-z]+$",
                "type": "string"
            },
            "postalCode": {
                "title": "Zip Code",
                "pattern": "^\\d{5}$",
                "type": "string"
            },
            "required": [
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
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    accessKey: {
        type: String,
        unique: true,
        required: true
    }
});

mongoose.model('AccessKey', userSchema);

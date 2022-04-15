const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model('Admins', adminSchema)

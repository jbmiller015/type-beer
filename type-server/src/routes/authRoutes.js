require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const jwtString = process.env.JWT_AUTH;

const router = express.Router();

router.route('/signup').post(async (req, res) => {
    const {email, password, accessKey} = req.body;
    if (accessKey) {
        try {
            const Key = mongoose.model('AccessKey')
            Key.findOneAndDelete({accessKey})
            const user = new User({email, password});
            await user.save();

            const token = jwt.sign({userId: user._id}, jwtString);
            res.send({token});
        } catch (e) {
            res.status(422).send(e.message);
        }
    } else {
        res.status(422).send('Beta Key Required. Contact jbmiller015@gmail.com for beta key.');
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password)
        return res.status(422).send('Must provide email and password');

    const user = await User.findOne({email});

    if (!user)
        return res.status(401).send('Invalid Password or email');

    try {
        await user.comparePassword(password);
        const token = jwt.sign({userId: user._id}, jwtString)
        res.send({token});
    } catch (e) {
        return res.status(422).send('Invalid Password or email');
    }


});

module.exports = router;

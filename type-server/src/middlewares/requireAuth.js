require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwtString = process.env.JWT_AUTH;

module.exports = (req, res, next) => {
    if (!req.url.includes('demo')) {
        const {authorization} = req.headers;

        if (!authorization)
            return res.status(401).send('You must be logged in.');

        let token = authorization.replace('Bearer ', '');

        //Comment out line below for postman testing
        token = token.substring(1, token.length - 1);

        jwt.verify(token, jwtString, async (err, payload) => {
            if (err) {
                console.log(err)
                return res.status(401).send('You must be logged in.');
            }

            const {userId} = payload;

            const user = await User.findById(userId);
            req.user = user;
            next();
        });
    }
    console.log(req.url)
    next();
};

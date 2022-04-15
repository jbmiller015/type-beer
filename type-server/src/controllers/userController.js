const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const User = mongoose.model('User');

exports.user_get = async (req, res) => {
    const getRes = await User.find({_id: req.user._id});
    res.send(getRes);
}

exports.user_email_put = async (req, res) => {
    try {
        await User.findOneAndUpdate({_id: req.user._id}, {email: req.body.email}, {
            upsert: true,
            useFindAndModify: false
        });
        res.send(req.body);
    } catch (e) {
        res.status(422).send(e.message);
    }
}

exports.user_password_put = async (req, res) => {

    try {
        const user = await User.findOne({_id: req.user._id});
        if (bcrypt.compareSync(req.body.oldPassword, user.password)) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);

            await User.findOneAndUpdate({_id: req.user._id}, {password: hash}, {
                upsert: true,
                useFindAndModify: false
            });
            res.status(200).send('Ok')
        }
    } catch (e) {
        console.log(e)
        return res.status(422).send('Invalid Password or email');
    }

}

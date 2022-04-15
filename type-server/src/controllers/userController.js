const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const User = mongoose.model('User');
const {v4: uuidv4} = require('uuid');

exports.user_get = async (req, res) => {
    const getRes = await User.find({_id: req.user._id});
    res.send(getRes);
}


exports.user_admin_access_key_get = async (req, res) => {

    const Key = mongoose.model('AccessKey');
    const uuid = uuidv4();
    if (await isAdmin(req.user._id)) {
        try {
            const key = new Key({accessKey: uuid})
            await key.save();
            res.send(key);
        } catch (e) {
            res.status(422).send(e.message);
        }
    } else {
        res.status(403).send('You do not have permission to access this resource.');
    }

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
        if (bcrypt.compareSync(req.body.oldPassword, user.password) || isAdmin(req.user._id)) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);

            await User.findOneAndUpdate({_id: req.user._id}, {password: hash}, {
                upsert: true,
                useFindAndModify: false
            });
            res.status(200).send('Ok')
        }
    } catch (e) {
        return res.status(422).send('Invalid Password or email');
    }

}

exports.user_admin_reset_password_put = async (req, res) => {

    if (await isAdmin(req.user._id)) {
        const {userId, newPass} = req.body;

        try {
            const user = await User.findOne({_id: userId});
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newPass, salt);

            await User.findOneAndUpdate({_id: req.user._id}, {password: hash}, {
                upsert: true,
                useFindAndModify: false
            });
            res.status(200).send('Ok')

        } catch (e) {
            return res.status(422).send('Invalid Password or email');
        }
    } else {
        res.status(403).send('You do not have permission to access this resource.');
    }

}

exports.user_admin_post = async (req, res) => {
    console.log(req.user)

    if (await isAdmin(req.user._id)) {
        const {userId, email} = req.body;
        const Admin = mongoose.model('Admins')

        try {
            const admin = new Admin({userId: mongoose.Types.ObjectId(userId), email: email})
            await admin.save()
            res.send(admin);
        } catch (e) {
            res.status(422).send(e.message);
        }
    } else {
        res.status(403).send('You do not have permission to access this resource.');
    }
}

exports.user_admin_get = async (req, res) => {
    if (await isAdmin(req.user._id)) {
        res.send(true);
    } else res.send(false);
}

const isAdmin = async (userId) => {
    const user = await User.findOne({_id: userId});
    try {
        const Admin = mongoose.model('Admins')
        const admin = await Admin.findOne({userId: mongoose.Types.ObjectId(user._id), email: user.email})
        return admin !== null
    } catch (e) {
        return false
    }

}

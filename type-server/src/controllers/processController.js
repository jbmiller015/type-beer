const mongoose = require("mongoose");
const moment = require("moment");


exports.process_active_get = async (req, res) => {
    let getRes;
    const {startDate, endDate, name} = req.query;
    const today = moment(0, "HH").utcOffset(0).startOf('date').toISOString(true);
    const Object = mongoose.model('Process');
    if (startDate && endDate) {
        try {
            getRes = await Object.find({
                userId: req.user._id,
                startDate: {$lte: new Date(startDate)},
                endDate: {$lte: new Date(endDate), $gte: new Date(startDate)}
            }).exec();
        } catch (err) {
            console.log(err);
        } finally {
        }
        try {
            const right = await Object.find({
                userId: req.user._id,
                startDate: {$gte: new Date(startDate), $lte: new Date(endDate)},
                endDate: {$gte: new Date(endDate)}
            }).exec();

            getRes.push(...right);
        } catch (err) {
            console.log(err);
        } finally {

        }


        let tankList = [];
        for (let el of getRes) {
            for (let le of el.phases) {
                const {startTank, endTank} = le;
                if (startTank.toString() === endTank.toString() && tankList.indexOf(startTank.toString()) === -1) {
                    tankList.push(startTank.toString());
                } else {
                    if (tankList.indexOf(startTank.toString()) === -1)
                        tankList.push(startTank.toString());
                    if (tankList.indexOf(endTank.toString()) === -1)
                        tankList.push(endTank.toString());
                }
            }
        }
        try {
            let tanks = await mongoose.model('Tank').find({userId: req.user._id, name: {$regex: name, $options: 'i'}})
            getRes = tanks.filter(tank => {
                return tankList.indexOf(tank._id.toString()) === -1
            });
        } catch (err) {
            console.log(err);
        } finally {

        }


    } else {
        try {
            getRes = await Object.find({
                userId: req.user._id,
                startDate: {$lte: today},
                endDate: {$gte: today}
            }).exec();
        } catch (err) {
            console.log(err);
        } finally {

        }
        if (getRes.length > 0) {
            for (let i = 0; i < getRes.length; i++) {
                for (let le of getRes[i].phases) {
                    if (moment(le.startDate).isSameOrBefore(today) && moment(le.endDate).isSameOrAfter(today)) {
                        getRes[i].activePhase = le;
                    }
                }
            }
        }
    }
    return res.status(200).json(getRes);
}

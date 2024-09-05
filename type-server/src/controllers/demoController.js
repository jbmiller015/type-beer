const tank = require('../Demo/Tank/DemoTank.json');
const beer = require('../Demo/Beer/DemoBeer.json');
const user = require('../Demo/User/DemoUser.json');
const process = require('../Demo/Process/DemoProcess.json');
const event = require('../Demo/Event/DemoEvent.json');
const moment = require("moment");

exports.demo_generic_get = async (req, res) => {
    const base = req.params.base;
    console.log("base:", base)
    try {
        res.send(getJsonData(base));
    } catch (e) {
        console.log(e)
        res.status(422).send(e.message);
    }
}

exports.demo_generic_sub_get = async (req, res) => {
    const base = req.params.base;
    const sub = req.params.sub;
    console.log(base, sub)
    try {
        res.send(getJsonSubData(base, sub));
    } catch (e) {
        res.status(422).send(e.message);
    }
}

exports.demo_generic_sub_ref_get = async (req, res) => {
    console.log(req)
    const base = req.params.base;
    const ref = req.params.ref;
    const sub = req.params.sub;
    try {
        res.send(getJsonRefData(base, sub, ref));
    } catch (e) {
        res.status(422).send(e.message);
    }
}

const getJsonData = (base) => {
    switch (base) {
        case "tank":
            return tank;
        case "beer":
            return beer;
        case "user":
            return user;
        case "process":
            return setDates(process);
        case "event":
            return setDates(event);

    }
}

const getJsonSubData = (base, id) => {
    switch (base) {
        case "tank":
            return getById(tank, id);
        case "beer":
            return getById(beer, id);
        case "user":
            return getById(user, id);
        case "process":
            return getById(process, id);
        case "event":
            return getById(event, id);

    }
}

//TODO: Does this ever get used?
const getJsonRefData = (base, id, ref) => {
    switch (base) {
        case "tank":
            return tank[id][ref];
        case "beer":
            return beer[id][ref];
        case "user":
            return user[id][ref];
        case "process":
            return process[id][ref];
        case "event":
            return event[id][ref];

    }
}

const getById = (obj, id) => {
    return obj.filter(el => {
        return el._id === id;
    })
}

const setDates = (data, startDate) => {
    let temp = data;
    return temp.map((obj, index) => {

        let start = moment(new Date(parseInt(obj.startDate, 10)));
        let end = moment(new Date(parseInt(obj.endDate, 10)));
        const dateDiff = end.diff(start, 'days');
        console.log(`dateDiff ${obj.name}:`, dateDiff)
        obj.startDate = moment(0, "HH").utcOffset(0).startOf('date').toISOString();
        obj.endDate = moment(0, "HH").utcOffset(0).endOf('date').add((dateDiff > 0 ? dateDiff : 1), 'days').toISOString();
        if (obj.phases) {

            obj.phases = setDates(obj.phases, obj.startDate);
        }
        if (obj.activePhase) {

            obj.activePhase = setDates([obj.activePhase], obj.startDate)[0];
        }
        return obj;
    })
}

const tank = require('../Demo/Tank/DemoTank.json');
const beer = require('../Demo/Beer/DemoBeer.json');
const user = require('../Demo/User/DemoUser.json');
const process = require('../Demo/Process/DemoProcess.json');
const event = require('../Demo/Event/DemoEvent.json');
const moment = require("moment");

exports.demo_generic_get = async (req, res) => {
    const base = req.params.base;
    try {
        res.send(getJsonData(base));
    } catch (e) {
        res.status(422).send(e.message);
    }
}

exports.demo_generic_sub_get = async (req, res) => {
    const base = req.params.base;
    const sub = req.params.sub;
    try {
        res.send(getJsonSubData(base, sub));
    } catch (e) {
        res.status(422).send(e.message);
    }
}

exports.demo_generic_sub_ref_get = async (req, res) => {
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
            return tank[id];
        case "beer":
            return beer[id];
        case "user":
            return user[id];
        case "process":
            return process[id];
        case "event":
            return event[id];

    }
}

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

const setDates = (data) => {
    return data.map((obj, index) => {
        let start = moment(new Date(parseInt(obj.startDate, 10)));
        let end = moment(new Date(parseInt(obj.endDate, 10)));
        const dateDiff = end.diff(start, 'days');
        obj.startDate = moment(0, "HH").utcOffset(0).startOf('date').add(index, 'days').toISOString();
        obj.endDate = moment(0, "HH").utcOffset(0).startOf('date').add((dateDiff + index), 'days').toISOString();
        if (obj.phases) {
            obj.phases = setDates(obj.phases);
        }
        return obj;
    })
}

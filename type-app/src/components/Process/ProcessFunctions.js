import moment from "moment";

export const mapDates = (startDate, phases) => {
    let nextDate = startDate;
    let rangeStartDate = startDate;
    let phaseDateRanges = [];
    const dateMappedPhases = phases.map((phase, index) => {
        let endDate = phase.endDate.split("T", 1)[0];
        let startDate = phase.startDate.split("T", 1)[0];
        let diff = moment(endDate).diff(startDate, "days");
        endDate = moment(nextDate).add(diff, "days").format("YYYY-MM-DD");
        phase.startDate = nextDate;
        phase.endDate = endDate;

        if (phase.phaseName === "Transfer") {
            phaseDateRanges = [...phaseDateRanges, {rangeStartDate, endDate, index}];
            rangeStartDate = endDate;
        }
        nextDate = endDate;
        return (phase)
    })

    return {phaseDateRanges, dateMappedPhases};
}


export const setPhaseTanks = (tank, index, dateRanges, phases) => {
    console.log(dateRanges);
    console.log(phases)
    let tempPhases = phases;
    if (dateRanges.length > 0) {
        let transferIndex = 0;

        while (index > dateRanges[transferIndex].index) {
            transferIndex++
        }
        let endIndex = dateRanges[transferIndex].index;
        if (index === endIndex) {
            endIndex = tempPhases.length
        }
        for (let i = index; i < endIndex; i++) {
            if (i > 0) {
                tempPhases[i].startTank = tempPhases[i - 1].endTank
            } else {
                tempPhases[i].startTank = tank
            }
            tempPhases[i].endTank = tank
        }
    } else {
        tempPhases.forEach((phase) => {
            phase.startTank = tank;
            phase.endTank = tank;
        })
    }
    return tempPhases;
}

export const filterSort = (entries, query, sort, setError) => {
    let ent = entries
    ent = filterEntries(ent, query, setError);
    ent = sortEntries(ent, sort)

    return ent;

}

export const filterEntries = (entries, query, setError) => {
    let [key, queryString] = query.split(' ', 2);
    if (query.length < 1) {
        return entries;
    }
    if (query.charAt(0) === ':' && queryString) {
        key = key.substring(1);
        const matcher = new RegExp(queryString, 'ig');
        let result;
        try {
            result = entries.filter((entry) => {
                return entry[key].match(matcher)
            })
        } catch (err) {
            if (err instanceof TypeError) {
                setError({
                    errorMessage: `Unrecognized Type '${key}'`
                })
            } else {
                setError({errorMessage: err.message});
            }
            return entries
        }

        return result

    } else {
        const matcher = new RegExp(query, 'ig')
        const result = entries.filter((entry) => {
            return entry.name.match(matcher)
        })
        console.log(result)
        return result
    }

}

export const sortEntries = (entries, sort) => {
    if (!sort || sort === undefined) {
        return entries
    } else {
        const key = sort[0];
        const direction = sort[1];
        const sorted = entries.sort((a, b) => {
            return (a[key].toLowerCase() > b[key].toLowerCase() ? 1 : ((b[key].toLowerCase() > a[key].toLowerCase()) ? -1 : 0))
        })
        return direction === 'desc' ? sorted : sorted.reverse();
    }
}

export const formatDate = (date) => {
    return moment(date.split("T", 1)[0]).format("M/D/YY")
}



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

import React, {useEffect, useState} from 'react';
import moment from "moment";
import Dropdown from "../Fields/Dropdown";

const CreateDuplicateProcess = (props) => {
    const {process, startDate} = props;
    const [phases, setPhases] = useState([]);
    const [endDate, setEndDate] = useState(null);
    const [dateRanges, setDateRanges] = useState([]);
    const [startTankSet, setStartTankSet] = useState(false);

    useEffect(() => {
        let nextDate = startDate;
        let rangeStartDate = startDate;
        let dateRanges = [];
        const dateMappedPhases = process.phases.map((phase, index) => {
            let endDate = phase.endDate.split("T", 1)[0];
            let startDate = phase.startDate.split("T", 1)[0];
            let diff = moment(endDate).diff(startDate, "days");
            endDate = moment(nextDate).add(diff, "days").format("YYYY-MM-DD");
            phase.startDate = nextDate;
            phase.endDate = endDate;

            if (phase.phaseName === "Transfer") {
                setDateRanges([...dateRanges, {rangeStartDate, endDate, index}]);
                rangeStartDate = endDate;
            }
            nextDate = endDate;
            return (phase)
        })
        setEndDate(dateMappedPhases[dateMappedPhases.length - 1].endDate);
        setPhases([...dateMappedPhases]);
    }, [])


    const startTank = () => {
        return (<div className={"field"}>
            {endDate ?
                <Dropdown label="Select Start Tank" defaultTerm={""}
                          onSelectedChange={(tank) => {
                              setTanks(tank._id, 0)
                          }}
                          url="tank"
                          index={0}
                          startDate={startDate}
                          endDate={endDate}
                          target={'startTank'}/> : null}
        </div>)
    }
    const transferTanks = () => {
        return (
            <div>
                <h5>{`This Process has ${dateRanges.length} Transfer${dateRanges.length < 1 ? "s" : ""}.`}</h5>
                {dateRanges.map((range, i) => {
                    return (<Dropdown label={`Select Transfer Tank ${i + 1}`} defaultTerm={""}
                                      onSelectedChange={(tank) => {
                                          setTanks(tank._id, dateRanges[i].index)
                                      }}
                                      url="tank"
                                      index={0}
                                      startDate={range.rangeStartDate}
                                      endDate={range.endDate}
                                      target={'startTank'}/>)
                })}
            </div>
        )
    }

    //set tanks for starting index to next transfer
    const setTanks = (tank, index) => {
        let tempPhases = phases
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
        console.log(tempPhases)
        setPhases([...tempPhases]);
    }

    return (<div>
        <h5 className={"header"}>{`Copying ${process.name}...`}</h5>
        <div className={"ui form"}>
            {startTank()}
            {dateRanges.length > 0 && !startTankSet ? transferTanks() : null}
        </div>
    </div>);
}
export default CreateDuplicateProcess;

import React, {useEffect, useState} from 'react';
import Dropdown from "../Fields/Dropdown";
import {mapDates, setPhaseTanks} from "./ProcessFunctions";

const CreateDuplicateProcess = (props) => {
    const {process, startDate, onSubmit} = props;
    const [phases, setPhases] = useState([]);
    const [endDate, setEndDate] = useState(null);
    const [dateRanges, setDateRanges] = useState([]);
    const [startTankSet, setStartTankSet] = useState(false);

    useEffect(() => {
        const {phaseDateRanges, dateMappedPhases} = mapDates(startDate, process.phases);
        console.log("dateRanges:", phaseDateRanges)
        console.log("dateMappedPhases:", dateMappedPhases)
        setDateRanges([...phaseDateRanges])
        setEndDate(dateMappedPhases[dateMappedPhases.length - 1].endDate);
        setPhases(dateMappedPhases);
    }, [])


    const startTank = () => {
        return (<div className={"field"}>
            {endDate ?
                <Dropdown label="Select Start Tank" defaultTerm={""}
                          onSelectedChange={(tank) => {
                              setTanksInPhases(tank._id, 0)
                              setStartTankSet(true)
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
                                          setTanksInPhases(tank._id, dateRanges[i].index)
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
    const setTanksInPhases = (tank, index) => {
        const tempPhases = setPhaseTanks(tank, index, dateRanges, phases);
        setPhases([...tempPhases]);
    }


    const submitButton = () => {
        return (dateRanges.length > 0 && startTankSet) || (dateRanges.length < 1 && startTankSet) ?
            <div className="ui basic center aligned segment" style={{marginBottom: "3%"}}>
                <button className="ui green button" type="Submit" style={{
                    left: "0",
                    right: "0",
                    marginLeft: "auto",
                    marginRight: "auto"
                }}
                        onClick={() => onSubmit(phases, endDate)}>Submit
                </button>
            </div> : null
    }

    return (<div>
        <h5 className={"header"}>{`Copying ${process.name}...`}</h5>
        <div className={"ui form"} onSubmit={() => onSubmit}>
            {startTank()}
            {dateRanges.length > 0 && startTankSet ? transferTanks() : null}
            {submitButton()}
        </div>
    </div>);
}
export default CreateDuplicateProcess;

import React, {useState, useEffect} from 'react';
import PhaseField from "./PhaseField";
import Dropdown from "../Fields/Dropdown";
import {mapDates, setPhaseTanks} from "./ProcessFunctions";

const CreateCustomProcess = (props) => {

    const {contents, startDate, validatePhase, onSubmit} = props;
    const [phases, setPhases] = useState([]);
    const [endDate, setEndDate] = useState(null);
    const [tanks, setTanks] = useState(false);

    const [startTankSet, setStartTankSet] = useState(false);

    const [dateRanges, setDateRanges] = useState([]);


    useEffect(() => {
        if (tanks) {
            const {phaseDateRanges, dateMappedPhases} = mapDates(startDate, phases);
            console.log("dateRanges:", phaseDateRanges)
            console.log("dateMappedPhases:", dateMappedPhases)
            setDateRanges([...phaseDateRanges])
            setEndDate(dateMappedPhases[dateMappedPhases.length - 1].endDate);
            setPhases(dateMappedPhases);
        }
    }, [tanks])


    const startTank = () => {
        return (<div className={"field"}>
            {endDate ?
                <Dropdown label="Select Start Tank" defaultTerm={""}
                          onSelectedChange={(tank) => {
                              setTanksInPhases(tank._id, 0)
                              setStartTankSet(true)
                          }}
                          url="/tank"
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
        setPhases(tempPhases);
    }

    const handleFieldChange = (index, e) => {
        let {name, value, checked} = e.target;
        if (name === "complete") {
            value = checked
        }
        let tempPhases = phases;
        if (name === "transfer") {
            tempPhases[index]["phaseName"] = "Transfer";
            tempPhases[index]['startDate'] = tempPhases[index - 1].endDate;
            tempPhases[index]['endDate'] = tempPhases[index - 1].endDate;
        } else if (name === "transferDate") {
            tempPhases[index]['startDate'] = value;
            tempPhases[index]['endDate'] = value;
        } else {
            tempPhases[index][name] = value;
        }
        setPhases([...tempPhases])
    }


    const addPhaseButton = () => {
        return (<div className="field">
            <div className="phase button" style={{alignItems: 'center', justifyContent: "center", display: 'flex'}}>
                <div className="ui primary button" onClick={addPhase}>
                    Add Phase
                </div>
            </div>
        </div>);
    }

    const doneButton = () => {
        return phases.length > 0 ?
            <div className="field">
                <div className="phase button" style={{alignItems: 'center', justifyContent: "center", display: 'flex'}}>
                    <div className="ui animated fade button" onClick={() => {
                        setTanks(true)
                        setEndDate(phases[phases.length - 1].endDate)
                    }}>
                        <div className="visible content">Done?</div>
                        <div className="hidden content">Set Tanks</div>
                    </div>
                </div>
            </div> : null;
    }

    const submitButton = () => {
        return (dateRanges.length > 0 && startTankSet) || (dateRanges.length < 1 && startTankSet) ?
            <div className="ui basic center aligned segment" style={{marginBottom:"3%"}}>
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


    const phaseFields = () => {
        return phases.map((phase, i) => {
            return <PhaseField
                phaseData={
                    phase
                }
                previousPhase={i > 0 ? phases[i - 1] : null}
                handleFieldChange={(index, e) => handleFieldChange(index, e)}
                key={i} index={i}
                removePhase={removePhase}
                validatePhase={validatePhase}
            />
        });
    }

    const addPhase = (e) => {
        e.preventDefault()
        const size = phases.length;
        if (phases.length > 0) {
            const newPhase = {
                startDate: phases[size - 1].endDate,
                startTank: phases[size - 1].endTank,
                endTank: phases[size - 1].endTank
            }
            setPhases([...phases, newPhase]);
        } else {
            setPhases([{startDate: startDate}])
        }
    }

    const removePhase = (index, e) => {
        e.preventDefault();
        let tempPhases = [...phases];
        phases.splice(index, 1);
        setPhases([...tempPhases]);
    }


    const phaseCollection = () => {
        return (phases.length >= 1) ?
            <div className={"phases"} style={{padding: "1%"/**, minWidth: screenSize()*/}}>
                <h3>Phases:</h3>
                <div className="form" style={{padding: "2%"}}>
                    <form className="ui form">
                        {phaseFields()}
                    </form>
                </div>
            </div> : null
    }

    return (<div>
        <div className={"ui form"}>
            {phaseCollection()}
            {addPhaseButton()}
            {doneButton()}
            {startTank()}
            {dateRanges.length > 0 && startTankSet ? transferTanks() : null}
            {submitButton()}
        </div>
    </div>);
}
export default CreateCustomProcess;

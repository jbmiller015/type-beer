import React, {useEffect, useState} from "react";
import Dropdown from "../Fields/Dropdown";

const PhaseField = (props) => {
    const {
        index,
        removePhase,
        handleFieldChange,
        phaseData,
        validatePhase
    } = props;

    console.log(phaseData)

    const [fieldName, setFieldName] = useState("field");
    const [transfer, setTransfer] = useState(false);
    const [editPhase, setEditPhase] = useState(true);
    const [phaseName, setPhaseName] = useState(phaseData.phase.phaseName);
    const [startDate, setStartDate] = useState(phaseData.phase.startDate);
    const [endDate, setEndDate] = useState(phaseData.phase.endDate);
    const [startTank, setStartTank] = useState(phaseData.phase.startTank);
    const [endTank, setEndTank] = useState(phaseData.phase.endTank);

    useEffect(() => {
        if (transfer) {
            phaseData.phaseName = "Transfer"
            setEndDate(startDate);
            handleFieldChange(
                index, {
                    target: {name: 'phaseName', value: "Transfer"}
                })
        } else {
            phaseData.phaseName = ""
        }
    }, [transfer]);


    const handleCheck = (e) => {
        let {checked} = e.target;
        checked ? setFieldName("disabled field") : setFieldName("field");
    }

    const handleTransferCheck = e => {
        let {checked} = e.target;
        if (checked) {
            setTransfer(true)
            setPhaseName("Transfer");
        } else {
            setTransfer(false);
            setPhaseName("")
        }
    };

    const endDateField = () => {

        return index > 0 && transfer ?
            <div className={fieldName} id={"startDate" || "endDate"}>
                <label>Transfer Date:</label>
                <input type="date" name="transferDate" value={startDate ? startDate : ""}
                       pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                       onChange={(e) => {
                           setEndDate(e.target.value)
                           setStartDate(e.target.value)

                       }}/>
            </div> : <div>
                <div className={fieldName} id={"startDate"}>
                    <label>Start Date:</label>
                    <input type="date" name="startDate" value={startDate ? startDate : ""}
                           pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                           onChange={(e) => setStartDate(e.target.value)}/>
                </div>
                <div className={fieldName} id={"endDate"}>
                    <label>End Date:</label>
                    <input type="date" name="endDate" value={endDate ? endDate : ""}
                           pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                           onChange={(e) => setEndDate(e.target.value)}/>
                </div>
            </div>
    };

    const endTankField = () => {

        return (index > 0 && transfer ? <div>
            <div className={fieldName} id={"startTank"}>
                <Dropdown label="Select Start Tank" onSelectedChange={setStartTank} url="tank" index={index}
                          target={'startTank'} defaultTerm={startTank ? startTank.name : ""}/>
            </div>
            <div className={fieldName} id={"endTank"}>
                <Dropdown label="Select End Tank" defaultTerm={endTank ? endTank.name : ""}
                          onSelectedChange={setEndTank} url="tank"
                          index={index}
                          target={'endTank'}/>
            </div>
        </div> : null)
    };

    const startTankField = () => {
        return phaseData.previousPhase === null ? <div>
            <div className={fieldName} id={"startTank"}>
                {endDate ? <Dropdown label="Select Start Tank" defaultTerm={startTank ? startTank.name : ""}
                                     onSelectedChange={(tank) => {
                                         setStartTank(tank);
                                         setEndTank(tank);
                                     }}
                                     url="tank"
                                     index={index}
                                     startDate={startDate}
                                     endDate={endDate}
                                     target={'startTank'}/> : null}
            </div>
            <div className={fieldName} id={"endTank"}>
            </div>
        </div> : null
    }

    function submitPhase() {
        const phase = {phaseName, startDate, endDate, startTank, endTank}
        const {valid, error} = validatePhase(phase);
        if (valid) {
            if (phaseName && startDate && endDate && startTank && endTank) {
                setEditPhase(false);
                setFieldName("field");
                handleFieldChange(index, {
                    target: {
                        name: 'submit',
                        value: {phaseName, startDate, endDate, startTank, endTank}
                    }
                })
            }
        } else {
            console.log(error.fields.length)
            for (let field of error.fields) {
                console.log(field)
                document.getElementById(field).className = "required field error"
            }
            for (let message of error.messages) {
                console.log(message)
            }
        }
    }

    return (

        !editPhase ?
            <div className="ui clearing segment">
                <h3>{phaseName}</h3>
                <h4>{startDate} - {endDate}</h4>
                <div className="ui left floated basic yellow icon button" onClick={(e) => setEditPhase(true)}>
                    <i className="edit icon"/>
                </div>
                <div className="ui right floated basic red icon button" onClick={(e) => removePhase(index, e)}>
                    <i className="trash alternate outline icon"/>
                </div>
            </div>
            :
            <div className="grouped fields"
                 style={{border: '1px solid #ccc', borderRadius: '10px', padding: '10px'}}>
                <div className={fieldName} id={"phaseName"}>
                    <label className="label">Phase {index + 1}: </label>
                    {index > 0 ? <div className="field">
                        <div className="ui checkbox">
                            <input type="checkbox" name="transfer" tabIndex="0"
                                   value={phaseName === "Transfer" ? phaseName : ""}
                                   defaultChecked={phaseName === "Transfer"}
                                   onChange={(e) => {
                                       handleTransferCheck(e)
                                   }}/>
                            <label>Transfer?</label>
                        </div>
                    </div> : null}
                    <input type="text" name="phaseName" value={phaseName ? phaseName : ""}
                           onChange={(e) => setPhaseName(e.target.value)}/>
                </div>
                {endDateField()}
                {startTankField()}
                {endTankField()}
                <div className="field">
                    <div className="ui checkbox">
                        <input type="checkbox" name="complete" tabIndex="0"
                               value={phaseData.complete ? phaseData.complete : false}
                               defaultChecked={phaseData.complete ? phaseData.complete : false}
                               onChange={(e) => {
                                   handleCheck(e)
                                   handleFieldChange(index, e)
                               }}/>
                        <label>Complete</label>
                    </div>
                </div>
                <div className={'inline fields'}>
                    <div className={'field'}>
                        <div className="ui left floated basic green icon button" onClick={(e) => {
                            submitPhase()
                        }}>
                            <i className="check icon"/>
                        </div>
                    </div>
                    <div className={'field'}>
                        <div className="ui right floated basic red icon button"
                             onClick={(e) => removePhase(index, e)}>
                            <i className="trash alternate outline icon"/>
                        </div>
                    </div>
                </div>
            </div>

    );
}

export default PhaseField;

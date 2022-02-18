import React, {useEffect, useState} from "react";
import Dropdown from "../Fields/Dropdown";
import moment from "moment";

const PhaseField = (props) => {
    const {
        index,
        removePhase,
        handleFieldChange,
        phaseData,
        validatePhase,
        previousPhase
    } = props;


    const [fieldName, setFieldName] = useState("field");
    const [transfer, setTransfer] = useState(phaseData.phaseName === "Transfer");
    const [editPhase, setEditPhase] = useState(true);
    const [phaseName, setPhaseName] = useState(phaseData.phaseName);
    const [startDate, setStartDate] = useState(phaseData.startDate);
    const [endDate, setEndDate] = useState(phaseData.endDate);
    const [startTank, setStartTank] = useState(phaseData.startTank);
    const [endTank, setEndTank] = useState(phaseData.endTank);

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
            handleFieldChange(index, e)

        } else {
            setTransfer(false);
            setPhaseName("")
            handleFieldChange(index, e)
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
                           handleFieldChange(index, e)
                       }}/>
            </div> : <div>
                <div className={fieldName} id={"startDate"}>
                    <label>Start Date:</label>
                    <input type="date" name="startDate" value={startDate ? startDate : ""}
                           pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                           onChange={(e) => {
                               setStartDate(e.target.value)
                               handleFieldChange(index, e)
                           }}/>
                </div>
                <div className={fieldName} id={"endDate"}>
                    <label>End Date:</label>
                    <input type="date" name="endDate" value={endDate ? endDate : ""}
                           pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                           onChange={(e) => {
                               setEndDate(e.target.value)
                               handleFieldChange(index, e)
                           }}/>
                </div>
            </div>
    };


    const endTankField = () => {
        return (index > 0 && transfer ? <div>
            <div className={fieldName} id={"startTank"}>
                <Dropdown label="Select Start Tank" onSelectedChange={setStartTank} url="tank"
                          target={'startTank'} defaultTerm={startTank ? startTank.name : ""} startDate={startDate}
                          endDate={endDate}/>
            </div>
            <div className={fieldName} id={"endTank"}>
                <Dropdown label="Select End Tank" defaultTerm={endTank ? endTank.name : ""}
                          onSelectedChange={setEndTank} url="tank"
                          target={'endTank'} startDate={startDate}
                          endDate={endDate}/>
            </div>
        </div> : null)
    };

    //TODO: Get phases w/out tanks first, then set tanks as needed (see create duplicate process flow)
    const startTankField = () => {
        return previousPhase === null && endDate ? <div>
            <div className={fieldName} id={"endTank"}>
                <div className={"field"}>
                    <Dropdown label="Select Start Tank" defaultTerm={""}
                              onSelectedChange={(tank) => {
                                  setStartTank(tank._id, 0)
                              }}
                              url="tank"
                              index={0}
                              startDate={startDate}
                              endDate={endDate}
                              target={'startTank'}/> : null}
                </div>
            </div>
        </div> : null
    }

    function submitPhase() {
        const phase = {phaseName, startDate, endDate, startTank, endTank}
        const {valid, error} = validatePhase(phase);
        if (valid) {
            if (phaseName && startDate && endDate) {
                setEditPhase(false);
                setFieldName("field");
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

    const formatDate = (date) => {
        return moment(date).format("M/D/YY")
    }


    return (
        !editPhase ?
            <div className="ui clearing segment">
                <h3>{phaseName}</h3>
                <h4>{formatDate(startDate)} --> {formatDate(endDate)}</h4>
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
                           onChange={(e) => {
                               setPhaseName(e.target.value)
                               handleFieldChange(index, e)
                           }}/>
                </div>
                {endDateField()}
                <div className="field">
                    <div className="ui checkbox">
                        <input type="checkbox" name="complete" tabIndex="0"
                               value={phaseData.complete ? phaseData.complete : false}
                               defaultChecked={phaseData.complete ? phaseData.complete : false}
                               onChange={(e) => {
                                   handleCheck(e)
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

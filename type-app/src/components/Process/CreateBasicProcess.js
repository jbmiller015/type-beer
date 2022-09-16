import React, {useEffect, useState} from 'react';
import Dropdown from "../Fields/Dropdown";

const CreateBasicProcess = (props) => {
    const {selectedContents, startDate, onSubmit} = props;
    const [phase, setPhase] = useState({startDate, phaseName: `Basic ${selectedContents} Brew`},)

    const endDateField = () => {
        return (
            <div className="required field">
                <label>End Date:</label>
                <input type="date" name="endDate"
                       onChange={(e) => {
                           setPhase({...phase, endDate: e.target.value})
                       }}/>
            </div>
        );
    }


    useEffect(() => {
        console.log("phase:", phase)
    }, [phase])
    const submitButton = () => {
        return (phase.endDate && phase.startTank && phase.endTank) ?
            <div className="ui basic center aligned segment" style={{marginBottom: "3%"}}>
                <button className="ui green button" type="Submit" style={{
                    left: "0",
                    right: "0",
                    marginLeft: "auto",
                    marginRight: "auto"
                }}
                        onClick={() => onSubmit([phase], phase.endDate)}>Submit
                </button>
            </div> : null
    }

    const defaultPhase = () => {
        return (
            <div>
                {endDateField()}
                <div className={"field"}>
                    {phase.endDate ?
                        <Dropdown label="Select Start Tank" defaultTerm={""}
                                  onSelectedChange={(tank) => {
                                      setPhase({...phase, startTank: tank._id, endTank: tank._id});
                                  }}
                                  url="tank"
                                  index={0}
                                  startDate={startDate}
                                  endDate={phase.endDate}
                                  target={'startTank'}/> : null}
                </div>
                {submitButton()}
            </div>
        )
    }


    return (<div>{defaultPhase()}</div>);
}
export default CreateBasicProcess;

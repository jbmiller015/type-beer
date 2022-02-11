import React, {useEffect, useState} from 'react';
import Dropdown from "../Fields/Dropdown";

const CreateBasicProcess = (props) => {
    const {contents, startDate} = props;
    const [endDate, setEndDate] = useState(null);
    const [tank, setTank] = useState(null);

    const endDateField = () => {
        return (
            <div className="required field">
                <label>End Date:</label>
                <input type="date" name="endDate"
                       onChange={(e) => {
                           setEndDate(e.target.value)
                       }}/>
            </div>
        );
    }

    const defaultPhase = () => {
        return (
            <div>
                {endDateField()}
                <div className={"field"}>
                    {endDate ?
                        <Dropdown label="Select Start Tank" defaultTerm={""}
                                  onSelectedChange={(tank) => {
                                      setTank(tank._id)
                                  }}
                                  url="tank"
                                  index={0}
                                  startDate={startDate}
                                  endDate={endDate}
                                  target={'startTank'}/> : null}
                </div>
            </div>
        )
    }


    return (<div>{defaultPhase()}</div>);
}
export default CreateBasicProcess;

import React, {useEffect, useState} from 'react';
import moment from "moment";
import {formatDate} from "./ProcessFunctions"
import useComponentVisible from "../Hooks/useComponentVisible";

const Phase = (props) => {
    let {
        index,
        removePhase,
        handlePhaseChange,
        phaseData,
        validatePhase,
        tanks
    } = props;

    const [color, setColor] = useState("");
    const [data, setData] = useState(phaseData);
    const [activeDateField, setActiveDateField] = useState("")

    const [percent, setPercent] = useState("")

    useEffect(() => {
        console.log(data)
        let startDate = phaseData.startDate.split("T", 1)[0];
        let endDate = phaseData.endDate.split("T", 1)[0];
        if (data.complete) {
            setColor("green");
            setPercent(100);
        } else {
            if (moment(startDate).isAfter(moment())) {
                setColor("");
                setPercent(0);
            } else if (moment().isBetween(startDate, endDate)) {
                let total = (moment(endDate).diff(startDate, "days"));
                let remaining = moment(endDate).diff(moment(), "days");
                let perc = (100 - ((remaining / total) * 100));
                setColor("yellow");
                setPercent(perc);
            } else {
                setColor("grey");
                setPercent(100);
            }
        }
    }, [data])

    const {ref, isComponentVisible, setIsComponentVisible} = useComponentVisible(false);

    return (<div className="ui centered card">
        <div className="content">
            <div className="ui medium header">{index + 1}</div>
        </div>
        <div className="content">
            <div className="ui small header">{phaseData.phaseName}</div>
            <div className="description">
                <p>Start Tank: {tanks.startTank.name}</p>

                <p>End Tank: {tanks.endTank ? tanks.endTank.name : tanks.startTank.name}</p>

                <p className="content" ref={ref} onClick={() => {
                    setIsComponentVisible(true)
                    setActiveDateField("start")
                }}>
                    Start Date: {isComponentVisible && activeDateField === "start" ?
                    <div className="ui fluid icon input">
                        <input name={"startDate"} type={"date"}
                               onChange={async (e) => {
                                   await handlePhaseChange(e, index);
                                   setData({...data, [e.target.name]: e.target.value});
                               }}/>
                        <i id="icon" className="check green icon"/>
                    </div> : formatDate(phaseData.startDate)}
                </p>

                <p className="content" ref={ref} onClick={() => {
                    setIsComponentVisible(true)
                    setActiveDateField("end")
                }}>
                    End Date: {isComponentVisible && activeDateField === "end" ?
                    <div className="ui fluid icon input">
                        <input name={"endDate"} type={"date"}
                               onChange={async (e) => {
                                   await handlePhaseChange(e, index);
                                   setData({...data, [e.target.name]: e.target.value});
                               }}/>
                        <i id="icon" className="check green icon"/>
                    </div> : formatDate(phaseData.endDate)}
                </p>
            </div>

        </div>
        <div className="extra content" style={{padding: "2%"}}>
            <div className="ui checkbox">
                <input type="checkbox" name="complete" tabIndex="0" onChange={async (e) => {
                    await handlePhaseChange(e, index);
                    setData({...data, [e.target.name]: e.target.checked});
                }} value={data.complete ? data.complete : false}
                       defaultChecked={data.complete ? data.complete : false}/>
                <label>Complete</label>
            </div>
        </div>
        <div className={`ui ${color} bottom attached progress`} data-percent="100">
            <div className="bar" style={{width: `${percent}%`}}>
            </div>
        </div>
    </div>);
}
export default Phase;

import React, {useEffect, useState} from 'react';
import moment from "moment";
import {formatDate} from "./ProcessFunctions"
import useComponentVisible from "../Hooks/useComponentVisible";

const Phase = (props) => {
    let {
        index,
        handlePhaseChange,
        phaseData,
        tanks
    } = props;

    const [color, setColor] = useState("");
    const [data, setData] = useState(phaseData);
    const [activeDateField, setActiveDateField] = useState("")

    const [percent, setPercent] = useState("")

    useEffect(() => {
        return () => {
            setData(null)
        }
    }, [])

    useEffect(() => {
        setData(phaseData)
    }, [phaseData])

    useEffect(() => {
        let startDate = formatDate(phaseData.startDate)
        let endDate = formatDate(phaseData.endDate)
        if (data.complete) {
            setColor("green");
            setPercent(100);
        } else {
            if (moment(startDate).startOf('date').isAfter(moment().startOf('date'))) {
                setColor("");
                setPercent(0);
            } else if (moment().isBetween(moment(startDate).startOf('date'), moment(endDate).endOf('date'))) {
                let total = (moment(endDate).diff(startDate, "days"));
                let remaining = moment(endDate).endOf('date').diff(moment(), "days");
                let perc = (100 - ((remaining / total) * 100));
                setColor("yellow");
                if (isNaN(perc))
                    setPercent(95)
                else
                    setPercent(perc);
            } else {
                setColor("red");
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
                <div>Start Tank: {tanks.startTank.name}</div>

                <div>End Tank: {tanks.endTank ? tanks.endTank.name : tanks.startTank.name}</div>

                <br/>
                <div className="content" ref={ref} onClick={() => {
                    setIsComponentVisible(true)
                    setActiveDateField("start")
                }}>
                    Start Date: {isComponentVisible && activeDateField === "start" ?
                    <div className="ui fluid input">
                        <input name={"startDate"} type={"date"}
                               onChange={async (e) => {
                                   setData({...data, [e.target.name]: e.target.value});
                                   await handlePhaseChange(e, index);
                               }}/>
                    </div> : formatDate(data.startDate)}
                </div>
                <div className="content" ref={ref} onClick={() => {
                    setIsComponentVisible(true)
                    setActiveDateField("end")
                }}>
                    End Date: {isComponentVisible && activeDateField === "end" ?
                    <div className="ui fluid  input">
                        <input name={"endDate"} type={"date"}
                               onChange={async (e) => {
                                   setData({...data, [e.target.name]: e.target.value});
                                   await handlePhaseChange(e, index);
                               }}/>
                    </div> : formatDate(data.endDate)}
                </div>
            </div>

        </div>
        <div className="extra content" style={{padding: "2%"}}>
            <div className="ui checkbox">
                <input type="checkbox" name="complete" tabIndex="0" onChange={async (e) => {
                    await handlePhaseChange(e, index);
                    setData({...data, [e.target.name]: e.target.checked});
                }} value={data.complete ? data.complete : false}
                       defaultChecked={data.complete ? data.complete : false}/>
                <label>{`Complete${data.complete ? '' : '?'}`}</label>
            </div>
        </div>
        <div className={`ui ${color} bottom attached progress`} data-percent="100">
            <div className="bar" style={{width: `${percent}%`}}>
            </div>
        </div>
    </div>);
}
export default Phase;

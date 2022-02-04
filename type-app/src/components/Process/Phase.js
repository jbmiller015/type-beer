import React, {useEffect, useState} from 'react';
import moment from "moment";

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
                setColor("yellow");
                setPercent((remaining / total) * 100);
            } else {
                setColor("grey");
                setPercent(100);
            }
        }
    }, [data])

    const formatDate = (date) => {
        return moment(date).format("M/D/YY")
    }

    return (<div className="ui centered card">
        <div className="content">
            <div className="ui medium header">{index + 1}</div>
        </div>
        <div className="content">
            <div className="ui small header">{phaseData.phaseName}</div>
            <div className="description">
                <p>Start Tank: {tanks.startTank.name}</p>
                <p>End Tank: {tanks.endTank ? tanks.endTank.name : tanks.startTank.name}</p>
                <p>Start Date: {formatDate(phaseData.startDate)}</p>
                <p>End Date: {formatDate(phaseData.endDate)}</p>
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

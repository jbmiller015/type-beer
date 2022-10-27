import React, {useState} from "react";
import EventMonth from "./EventMonth";

const EventYear = (props) => {

    const year = props.data[0];
    const [months, setMonths] = useState(props.data[1]);
    const [showActive, setShowActive] = useState(props.activeYear);


    const eventMonths = () => {
        if (months) {
            return Object.entries(months).map((month, i) => {
                const activeMonth = (month[0] === new Date().getMonth().toString() && showActive);
                return <EventMonth data={month} activeMonth={activeMonth} key={"eventMonth" + i}/>
            })
        }
    }

    return (<div>
        <div className={`${showActive ? "active" : ""} title`} onClick={() => {
            setShowActive(!showActive)
        }}>{year}</div>
        <div className={`${showActive ? "active" : ""} content`}>
            <div className={'ui styled accordion'}>{eventMonths()}</div>
        </div>
    </div>)

}

export default EventYear;

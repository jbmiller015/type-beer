import React, {useState} from "react";
import EventMonth from "./EventMonth";

const EventYear = (props) => {

    const year = props.data[0];
    const [months, setMonths] = useState(props.data[1]);


    const eventMonths = () => {
        if (months) {
            return Object.entries(months).map((month, i) => {
                return <EventMonth data={month} key={"eventMonth" + i}/>
            })
        }
    }

    return (<div className={"ui padded segment"}>
        <div className={"ui header"}>{year}</div>
        <div className={'ui segments'}>{eventMonths()}</div>
    </div>)

}

export default EventYear;

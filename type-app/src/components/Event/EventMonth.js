import React, {useState} from 'react';
import moment from "moment";
import EventSegment from "./EventSegment";

const EventMonth = (props) => {
    console.log(props.data)
    const month = props.data[0];
    const [events, setEvents] = useState(props.data[1]);
    const monthName = moment().month(month).format("MMMM");

    const eventSegments = () => {
        return events.map((event, i) => {
            return <EventSegment data={event} key={"eventSegment" + i}/>
        })
    }

    return (<div className={"ui padded segment"}>
        <div className={"ui header"}>{monthName}</div>
        <div className={'ui divided items'}>{eventSegments()}</div>
    </div>);
}
export default EventMonth;

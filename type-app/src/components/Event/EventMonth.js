import React, {useState} from 'react';
import moment from "moment";
import EventSegment from "./EventSegment";

const EventMonth = (props) => {
    const month = props.data[0];
    const [events, setEvents] = useState(props.data[1]);
    const monthName = moment().month(month).format("MMMM");
    const [showActiveMonth, setShowActiveMonth] = useState(props.activeMonth);

    const eventSegments = () => {
        return events.map((event, i) => {
            return <EventSegment data={event} key={"eventSegment" + i} deleteEvent={props.deleteEvent}
                                 handleEventChange={props.handleEventChange}/>
        })
    }

    return (
        <div>
            <div className={`${showActiveMonth ? "active" : ""} title`} onClick={() => {
                setShowActiveMonth(!showActiveMonth)
            }}>{monthName}</div>
            <div className={`${showActiveMonth ? "active" : ""} content`}>
                <div className={'ui segments'}
                     style={{borderStyle: "none", boxShadow: "none"}}>{eventSegments()}</div>
            </div>
        </div>);
}
export default EventMonth;

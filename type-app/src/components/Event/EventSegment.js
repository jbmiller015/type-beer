import React, {useState} from 'react';
import moment from "moment";

const EventSegment = (props) => {
    const [eventData, setEventData] = useState(props.data);

    const formatDate = (date) => {
        return moment(date.split("T", 1)[0]).format("dddd, Do")
    }


    console.log(eventData)
    return (
        <div className={"ui compact segment"}>
            <div className={"ui item"}>
                <div className={"content"}>
                    <div className={"ui small header"}>{formatDate(eventData.startDate)}</div>
                    <div className={"meta"}>
                        <span className={"ui medium header"}>{eventData.name + " |"}</span>
                        <span className={"ui tiny yellow header"}
                              style={{paddingLeft: "3px"}}>{eventData.eventType}</span>
                    </div>
                    <div className="description">
                        <p>{eventData.details}</p>
                    </div>
                </div>
            </div>
        </div>);
}
export default EventSegment;

import React from 'react';

const Event = (props) => {
    const {event, color, processesActive, calModalData} = props;

    return (
        <div
            className={`ui fluid button`}
            style={['#0954C4', '#0B4DA4', '#0C427D', '#0D3655', '#0B2532', '#08140E', '#1259E6'].includes(color) ? {
                backgroundColor: color,
                padding: "5px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                color: "white"
            } : {
                backgroundColor: color,
                padding: "5px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis"
            }}
            onClick={() => {
                calModalData(event._id, null);
            }}
        >{processesActive ? event.name : event.name}</div>);
}
export default Event;

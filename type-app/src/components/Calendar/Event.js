import React from 'react';

const Event = (props) => {
    const {event, tank, color, processesActive, calModalData} = props;

    return (
        <div
            className={`ui fluid button`}
            style={['#C96E12', '#9C5511', '#6F3B10', '#42220F', '#14080E'].includes(color) ? {
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
                calModalData(event._id, tank._id)
            }}
        >{processesActive ? event.name : tank.name}</div>);
}
export default Event;

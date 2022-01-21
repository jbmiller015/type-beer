import React from 'react';

const Event = (props) => {
    const {event, color} = props;

    return (<div
        className={`ui ${['#C96E12', '#9C5511', '#6F3B10', '#42220F', '#14080E'].includes(color) ? 'inverted ' : ''}segment`}
        style={{backgroundColor: color, padding: "3px"}}>{event.name}</div>);
}
export default Event;

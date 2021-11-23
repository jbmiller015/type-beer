import React from "react";

const TankContent = (props) =>{
    return(
        <div className="content">
        <p>Beer: {props.contents && props.contents.name ? props.contents.name : null}</p>
        <p>Style: {props.contents && props.contents.style !== null ? props.contents.style : null}</p>
        <p>Current Phase: {props.currPhase || null}</p>
        <p>Date: {new Intl.DateTimeFormat('en-US').format(new Date(props.currPhaseDate)) || null}<br/>
            Time: {new Intl.DateTimeFormat('en-US', {hour: '2-digit', minute: '2-digit'})
                .format(new Date(props.currPhaseDate)) || null}</p>
        <p>Next Phase: {props.nextPhase || null}</p>
        <p>Tank Size: {props.size || null}</p>
    </div>
    );
}
export default TankContent;

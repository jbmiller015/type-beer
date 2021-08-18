import React from 'react';


//Should adjust look if filled
const Tank = (props) => {
    console.log(props.tankData);
    return (
        <div>
            <h2>{props.tankData.name ? props.tankData.name : ""}</h2>
            <p>Size: {props.tankData.size ? props.tankData.size : ""}</p>
            <p>Beer: {props.tankData.contents ? props.tankData.contents  : ""}</p>
            <p>Fill: {props.tankData.fill ? props.tankData.fill : ""}</p>
            <p>Fill Date: {props.tankData.fillDate ? props.tankData.fillDate : ""}</p>
            <p>Current Phase: {props.tankData.currPhase ? props.tankData.currPhase : ""}</p>
            <p>Current Phase End Date: {props.tankData.currPhaseDate ? props.tankData.currPhaseDate : ""}</p>
            <p>Next Phase: {props.tankData.nextPhase ? props.tankData.nextPhase : ""}</p>
        </div>
    );
};

export default Tank;

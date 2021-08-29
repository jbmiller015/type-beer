import React from 'react';


//Should adjust look if filled
const Tank = (props) => {

    const dateFormat = (date) => {
        let datetime = new Date(date);
        let result = datetime.getMonth();
        result += "/" + datetime.getDay();
        result += "/" + datetime.getFullYear();
        return result;
    }

    return (
        <div className={"card"}>
            <div className={"image"}>
                <img src={props.tankData.contents.image ? props.tankData.contents.image : ""}/>
            </div>
            <div className={"content"}>
                <div className={"header"}>{props.tankData.name ? props.tankData.name : ""}</div>
                <div className={"meta"}>{props.tankData.size ? props.tankData.size : ""}</div>
                <div
                    className={"description"}>Contents: {props.tankData.contents.name ? props.tankData.contents.name : ""}</div>
                <div className={"description"}>Current
                    Phase: {props.tankData.currPhase ? props.tankData.currPhase : ""}</div>
                <div className={"description"}>Next
                    Phase: {props.tankData.nextPhase ? props.tankData.nextPhase : ""}</div>
                <div className={"description"}>Fill: {props.tankData.fill ? props.tankData.fill : ""}</div>
            </div>
            <div className={"extra content"}>
                <span
                    className={"right floated"}>Fill Date: {props.tankData.fillDate ? dateFormat(props.tankData.fillDate) : ""}</span>
                <span>Current Phase End Date: {props.tankData.currPhaseDate ? dateFormat(props.tankData.currPhaseDate) : ""}</span>
            </div>
        </div>
    );
};

export default Tank;

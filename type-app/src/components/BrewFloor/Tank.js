import React from 'react';
import tankImage from '../../media/tankw.png'
import './tank.css'
import moment from "moment";


//Should adjust look if filled
const Tank = (props) => {

    const {currPhase, currPhaseDate, contents} = props.tankData;

    const dateFormat = (date) => {
        let datetime = new Date(date);
        let result = datetime.getMonth();
        result += "/" + datetime.getDay();
        result += "/" + datetime.getFullYear();
        return result;
    };

    const remainingTime = (phaseDate) => {
        const nextMoment = moment(phaseDate);
        return nextMoment.toNow(true);
    };

    return (
        <div id={"container"} className={"col-lg-3"}>
            <div className={"img-container"}>
                <div className={"positioning"}>
                    <div className={"ui card"} style={{maxWidth: '100%'}}>
                        <div className={"image"}>
                            <img src={contents.image ? contents.image : tankImage}/>
                        </div>
                        <div className={"content"}>
                            <div className={"header"}>{contents.name ? contents.name : ""}</div>
                            <div
                                className={"meta"}>{remainingTime(currPhaseDate) ? remainingTime(currPhaseDate) : ""}</div>

                        </div>
                        <div className={"extra content"}>
                        <span
                            className={"right floated"}>Current Phase: {currPhase ? currPhase : ""}</span>
                        </div>
                    </div>
                </div>
                <img className={"outerImage"} src={tankImage}/>
            </div>
        </div>
    );
};

export default Tank;


// <div
//     className={"description"}>Contents: {props.tankData.contents.name ? props.tankData.contents.name : ""}</div>
// <div className={"description"}>Current
//     Phase: {props.tankData.currPhase ? props.tankData.currPhase : ""}</div>
// <div className={"description"}>Next
//     Phase: {props.tankData.nextPhase ? props.tankData.nextPhase : ""}</div>
// <div className={"description"}>Fill: {props.tankData.fill ? props.tankData.fill : ""}</div>

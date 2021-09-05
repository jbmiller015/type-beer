import React, {useState} from 'react';
import tankImage from '../../media/tankw.png';
import tankOverlay from '../../media/tankwwindow.png';
import moment from "moment";
import mergeImages from 'merge-images';


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
        return nextMoment.toNow();
    }

    const imageWrapper = {
        backgroundColor: contents.image ? '' : '#DAA520',
        backgroundImage: `url(${contents.image})`,
        backgroundSize: '70% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    }


    return (
        <div className={"center aligned column"}>
            <div className={"ui link cards"}>
                <div className={"card"}>
                    <div className={"image"} style={imageWrapper}>
                        <img src={tankOverlay}/>
                    </div>
                    <div className={"content"}>
                        <div className={"header"}>{contents.name ? contents.name : ""}</div>
                        <div className={"meta"}>{remainingTime(currPhaseDate) ? remainingTime(currPhaseDate) : ""}</div>
                    </div>
                    <div className={"extra content"}>
                        <span>Current Phase: {currPhase ? currPhase : ""}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tank;


//
//<div
//     className={"description"}>Contents: {props.tankData.contents.name ? props.tankData.contents.name : ""}</div>
// <div className={"description"}>Current
//     Phase: {props.tankData.currPhase ? props.tankData.currPhase : ""}</div>
// <div className={"description"}>Next
//     Phase: {props.tankData.nextPhase ? props.tankData.nextPhase : ""}</div>
// <div className={"description"}>Fill: {props.tankData.fill ? props.tankData.fill : ""}</div>

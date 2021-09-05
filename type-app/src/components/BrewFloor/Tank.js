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
        return nextMoment.toNow(true);
    }

    const OverlayImageStyle = {
        position: "absolute",
        top: "0",
        left: "0",
        maxWidth: "300px",
        maxHeight: "300px"
    }

    const innerImageStyle = {
        position: "absolute",
        top: "85px",
        left: "85px",
        maxWidth: "110px",
        maxHeight: "300px",
    }

    const imageWrapper = {
        position: "relative",
        maxWidth: "100%"
    }
    const card = {
        border: "2px",
        height: "300px"
    }

    const content = {
        padding: "2px 16px"
    }

    return (
        <div className={"column"}>

            <div className={"ui link cards"}>
                <div className={"card"}>
                    <div className={"image"} style={{
                        backgroundImage: `url(${contents.image})`,
                        backgroundSize: '70% 100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }}>
                        <img src={tankOverlay}/>
                    </div>
                    <div className={"content"}>
                        <div className={"header"}>{contents.name ? contents.name : ""}</div>
                        <div
                            className={"meta"}>{remainingTime(currPhaseDate) ? remainingTime(currPhaseDate) : ""}</div>
                    </div>
                    <div className={"extra content"}>
                        <span className={"right floated"}>Current Phase: {currPhase ? currPhase : ""}</span>
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

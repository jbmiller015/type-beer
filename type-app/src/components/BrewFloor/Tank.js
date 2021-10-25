import React, {useState} from 'react';
import tankOverlay from '../../media/tankwwindow.png';
import moment from "moment";
import Modal from "../modal/Modal";

//Should adjust look if filled
const Tank = (props) => {

    const {currPhase, currPhaseDate, contents, fill, _id} = props.tankData;

    /*const dateFormat = (date) => {
        let datetime = new Date(date);
        let result = datetime.getMonth();
        result += "/" + datetime.getDay();
        result += "/" + datetime.getFullYear();
        return result;
    };*/

    const remainingTime = (phaseDate) => {
        const nextMoment = moment(phaseDate);
        return nextMoment.toNow();
    }

    const imageWrapper = {
        backgroundColor: (contents && !contents.image && fill) ? '#DAA520' : '',
        backgroundImage: `url(${contents ? contents.image : ''})`,
        backgroundSize: '70% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    }


    return (
        <div className="four wide column">
            <div className={"ui cards"}>
                <div className={"card"}>
                    <div className={"image"} style={imageWrapper}>
                        <img alt="tankOverlay" src={tankOverlay}/>
                    </div>
                    <div className={"content"}>
                        <div className={"header"}>{contents && contents.name ? contents.name : ""}</div>
                        <div className={"meta"}>{remainingTime(currPhaseDate) ? remainingTime(currPhaseDate) : ""}</div>
                    </div>
                    <div className={"extra content"}>
                        <span style={{fontSize: "medium"}}>{currPhase ? currPhase : ""}</span>
                    </div>
                    <button className="ui bottom attached button" onClick={() => props.onClick(props.tankData)}>
                        <i className="setting icon"></i>
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Tank;


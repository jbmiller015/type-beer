import React, {useState} from 'react';
import tankOverlay from '../../media/tankwwindow.png';
import moment from "moment";

//Should adjust look if filled
const TankDetail = (props) => {

    const [edit, setEdit] = useState(false);

    const {currPhase, currPhaseDate, contents, fill, _id, tankName} = props.tankData;


    const remainingTime = (phaseDate) => {
        const nextMoment = moment(phaseDate);
        return nextMoment.toNow();
    }

    return (
        <div>
            <div className="item">
                <div className="ui small image">
                    <img src={contents.image} alt={"contents"}/>
                </div>
                <div className="content">
                    <div className="header">{tankName}</div>
                    <div className="meta">
                        <span className="contents">{contents.name}</span>
                        <span
                            className="timeRemaining">{remainingTime(currPhaseDate) ? remainingTime(currPhaseDate) : ""}</span>
                    </div>
                    <div className="description">
                        <p>Current Phase: {currPhase}</p>
                        <p>{currPhaseDate}</p>
                        <p>{props.tankData.action}</p>
                        <p>{contents.type}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default TankDetail;


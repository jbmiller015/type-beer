import React, {useEffect, useState} from 'react';
import tankOverlay from '../../media/tankwwindow.png';
import bTankOverlay from '../../media/britetankwwindow.png'
import kTankOverlay from '../../media/kettletankwwindow.png'
import barrelOverlay from '../../media/barreltankwwindow.png'
import moment from "moment";

//const moment = moment.utcOffset(-360)

const Tank = (props) => {

    const [className, setClassName] = useState("card");
    const [contents, setContents] = useState(null);
    const {currPhase, currPhaseDate, fill, name, tankType} = props.tankData;
    const process = props.process;
    const {getContents} = props;


    useEffect(async () => {
        if (process) {
            moment().diff(process.endDate) > 0 ? setClassName("red card") : setClassName("green card")
            const contents = await getContents(process.contents)
            setContents(contents);
        }
    }, [])


    const imageWrapper = {
        backgroundColor: (process && fill) ? '#DAA520' : '',
        backgroundSize: '70% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    };

    const cardStyle = {
        marginBottom: "2%"
    };

    const phase = () => {
        if (process) {
            return process.activePhase.phaseName ? process.activePhase.phaseName : ""
        } else {
            return "Empty"
        }
    }

    const date = () => {
        if (process) {
            let endDate = process.activePhase.endDate.split("T", 1)[0];
            let startDate = process.activePhase.startDate.split("T", 1)[0];
            return moment(endDate).startOf("day").fromNow(true) || ""
        }
    }
    const nextPhase = () => {
        if (process) {
            const len = (process.phases.length);
            for (let i = 0; i < len; i++) {
                if (len === 1) {
                    return "Next Phase: Done"
                }
                if (process.phases[i].phaseName === process.activePhase.phaseName && process.phases[i].startDate === process.activePhase.startDate) {
                    return (`Next Phase: ${i + 1 < len ? process.phases[i + 1].phaseName : "Done"}`)

                }
            }
        } else {
            return "---"
        }
    }

    const overlay = () => {
        switch (tankType) {
            case "brite":
                return bTankOverlay
            case "fermenter":
                return tankOverlay
            case "kettle" :
                return kTankOverlay
            case "barrel":
                return barrelOverlay
            default:
                return tankOverlay
        }
    }

    return (
        <div className={"item"}>
            <div className={"ui cards"} style={cardStyle}>
                <div className={className}>
                    <div className="ui basic big top center aligned attached label" style={{zIndex: "1"}}>{name}</div>
                    <div className={"image"} style={imageWrapper}>
                        <img alt="tankOverlay" src={overlay()}/>
                    </div>
                    <div className={"content"}>
                        <div
                            className={"center aligned header"}>{contents && contents.name ? contents.name : "¯\\_(ツ)_/¯"}</div>
                        <div
                            className={"center aligned meta"}
                            style={{
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis"
                            }}>{process ? phase() + ": " + date() + " remaining" : "Empty"}</div>
                    </div>
                    <div className={"center aligned extra content"}>
                        <span style={{fontSize: "medium"}}>{nextPhase()}</span>
                    </div>
                    {props.detailButtonVisible ?
                        <button className="ui bottom attached button"
                                onClick={() => props.loadData(props.tankData, process)}>
                            <i className="setting icon"/>
                            Details
                        </button> : null}
                </div>
            </div>
        </div>
    );
};

export default Tank;


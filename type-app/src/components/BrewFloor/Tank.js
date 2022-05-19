import React, {useEffect, useState} from 'react';
import tankOverlay from '../../media/tankwwindow.png';
import bTankOverlay from '../../media/britetankwwindow.png'
import kTankOverlay from '../../media/kettletankwwindow.png'
import barrelOverlay from '../../media/barreltankwwindow.png'
import moment from "moment";
import {formatDate} from "../Process/ProcessFunctions";

const Tank = (props) => {

    const [className, setClassName] = useState("card");
    const [contents, setContents] = useState(null);
    const [color, setColor] = useState("");

    const [percent, setPercent] = useState("")
    const { fill, name, tankType} = props.tankData;
    const process = props.process;
    const {getContents} = props;

    useEffect(async () => {
        if (process) {
            const contents = await getContents(process.contents)
            setContents(contents);
            let startDate = formatDate(process.startDate)
            let endDate = formatDate(process.endDate)
            if (process.complete) {
                setColor("green");
                setPercent(100);
            } else {
                if (moment(startDate).startOf('date').isAfter(moment().startOf('date'))) {
                    setColor("");
                    setPercent(0);
                } else if (moment().isBetween(moment(startDate).startOf('date'), moment(endDate).endOf('date'))) {
                    let total = (moment(endDate).diff(startDate, "days"));
                    let remaining = moment(endDate).endOf('date').diff(moment(), "days");
                    let perc = (100 - ((remaining / total) * 100));
                    setColor("yellow");
                    if (isNaN(perc))
                        setPercent(95)
                    else
                        setPercent(perc);
                } else {
                    setColor("red");
                    setPercent(100);
                }
            }
        }
    }, [process])


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
                    {props.process ? <div className={`ui ${color} bottom attached progress`} data-percent="100">
                        <div className="bar" style={{width: `${percent}%`}}>
                        </div>
                    </div> : null}
                </div>
            </div>
        </div>
    );
};

export default Tank;


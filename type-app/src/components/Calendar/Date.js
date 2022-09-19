import React, {useEffect, useState} from 'react';
import Event from "./Event";
import moment from "moment";
import PhaseEvent from "./PhaseEvent";

const Date = (props) => {
    const {events, phases, date, week=false, processesActive, getTankDetails, calModalData} = props;
    const isSameWeek = date.isSame(moment(), "week", []);
    const isSameDay = date.isSame(moment(), "day");
    const [showExtended, setShowExtended] = useState(false);

    console.log(date)
    useEffect(() => {
    }, [showExtended]);

    const style = () => {
        let style;
        if (isSameWeek && !isSameDay) {
            style = {
                padding: "5px",
                backgroundColor: "#EBF1FF",
                overflow: showExtended ? "visible" : "hidden",
                zIndex: showExtended ? "2" : "",
                position: showExtended ? "relative" : ""
            }
        } else if (isSameDay) {
            style = {
                padding: "5px",
                backgroundColor: "#D6E2FF",
                overflow: showExtended ? "visible" : "hidden",
                zIndex: showExtended ? "2" : "",
                position: showExtended ? "relative" : ""
            }
        } else {
            style = {
                padding: "5px",
                overflow: showExtended ? "visible" : "hidden",
                zIndex: showExtended ? "2" : "",
                position: showExtended ? "relative" : ""
            }
        }
        return style
    }

    const mapEvents = () => {
        const mapped = phases.map((phase, i) => {
            let tankId = null;
            for (let el of phase.phases) {
                let endDate = el.endDate.split("T", 1)[0];
                let startDate = el.startDate.split("T", 1)[0];
                if (date.isBetween(startDate, endDate, 'date', "[]")) {
                    if (el.startTank !== el.endTank) {
                        tankId = el.endTank;
                    } else {
                        tankId = el.startTank;
                    }
                }
            }
            if (tankId) {
                const tank = getTankDetails(tankId)
                return <PhaseEvent event={phase} color={phase.color} key={i} processesActive={processesActive}
                                   date={date} tank={tank}
                                   calModalData={(processId, tankId) => calModalData(processId, tankId, date)}/>
            }
        })
        mapped.push(
            ...events.map((phase, i) => {
                return <Event event={phase} color={phase.color} key={i} processesActive={processesActive}
                              date={date}
                              calModalData={(processId) => calModalData(processId, null, date)}/>
            }))
        if (mapped.length > 3 && !week && !showExtended) {
            return ([mapped[0], mapped[1],
                <div className="ui grey fluid button" style={{padding: "5px"}}
                     key={100} onClick={() => {
                    setShowExtended(true)
                }}>{mapped.length - 2 + ' more'}</div>])
        }
        if (showExtended) {
            return ([...mapped,
                <div className="ui grey fluid icon button" style={{padding: "5px"}}
                     key={101} onClick={() => {
                    setShowExtended(false)
                }}>
                    <i className={"angle up icon"}/>
                </div>])
        } else return mapped;
    }
    return (
        <div className={"column"}
             style={style()}>
            <div className={"ui basic segment"} style={{padding: "0"}}>
                <p>{date.get('date')}</p>
            </div>
            <div className={events.length > 0 ? "ui raised segments" : null}>
                {mapEvents()}
            </div>
        </div>
    );
}
export default Date;

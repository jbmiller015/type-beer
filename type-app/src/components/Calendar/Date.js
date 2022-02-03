import React, {useEffect, useState} from 'react';
import Event from "./Event";
import moment from "moment";

const Date = (props) => {
    const {events, date, week, processesActive, getTankDetails, calModalData} = props;
    const isSameWeek = date.isSame(moment(), "week", []);
    const isSameDay = date.isSame(moment(), "day");

    const style = () => {
        let style;
        if (isSameWeek && !isSameDay) {
            style = {
                padding: "5px",
                backgroundColor: "#EBF1FF"
            }
        } else if (isSameDay) {
            style = {
                padding: "5px",
                backgroundColor: "#D6E2FF"
            }
        } else {
            style = {padding: "5px"}
        }
        return style
    }

    const mapEvents = () => {
        const mapped = events.map((event, i) => {
            let tankId = null;
            for (let el of event.phases) {
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
                return <Event event={event} color={event.color} key={i} processesActive={processesActive}
                              date={date} tank={tank}
                              calModalData={(processId, tankId) => calModalData(processId, tankId)}/>
            }
        })

        if (mapped.length > 3 && !week) {
            return ([mapped[0], mapped[1],
                <div className="ui grey fluid button" style={{padding: "5px"}}
                     key={100}>{mapped.length - 2 + ' more'}</div>])
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

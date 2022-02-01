import React from 'react';
import Event from "./Event";

const Date = (props) => {
    const {events, date} = props;
    const mapEvents = () => {
        const mapped = events.map((event, i) => {
            return <Event event={event} color={event.color} key={i}/>
        })

        if (mapped.length > 3) {
            return ([mapped[0], mapped[1],
                <div className="ui grey fluid button" style={{padding: "5px"}}
                     key={100}>{mapped.length - 2 + ' more'}</div>])
        } else return mapped;
    }
    return (
        <div className={"column"} style={{padding: "5px"}}>
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

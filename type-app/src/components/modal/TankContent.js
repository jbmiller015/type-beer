import React from "react";

const TankContent = ({data}) => {

    return (
        <div className="content">
            <p>Beer: {data.contents && data.contents.name ? data.contents.name : null}</p>
            <p>Style: {data.contents && data.contents.style !== null ? data.contents.style : null}</p>
            <p>Current Phase: {data.currPhase || null}</p>
            <p>Date: {new Intl.DateTimeFormat('en-US').format(new Date(data.currPhaseDate)) || null}<br/>
                Time: {new Intl.DateTimeFormat('en-US', {hour: '2-digit', minute: '2-digit'})
                    .format(new Date(data.currPhaseDate)) || null}</p>
            <p>Next Phase: {data.nextPhase || null}</p>
            <p>Tank Size: {data.size || null}</p>
        </div>
    );
}
export default TankContent;

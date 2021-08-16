import React from 'react';


//Should adjust look if filled
const Tank = (tankData) => {
    return (
        <div>
            <h2>{tankData.name}</h2>
            <p>Size: {tankData.size}</p>
            <p>Beer: {tankData.beer.name}</p>
            <p>Fill: {tankData.fill}</p>
            <p>Fill Date: {tankData.fillDate}</p>
            <p>Current Phase: {tankData.currPhase}</p>
            <p>Current Phase End Date: {tankData.currPhaseDate}</p>
            <p>Next Phase: {tankData.nextPhase}</p>
        </div>
    );
};

export default Tank;

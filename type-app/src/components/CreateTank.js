import React from 'react';

const CreateTank = (currTank) => {
    return (<div>
        <form>
            <div className="field">
                <label>Name:</label>
                <input type="text" name="name"/>
            </div>
            <div className="field">
                <label>Size:</label>
                <input type="text" name="size"/>
            </div>
            <div className="field">
                <label>Contents:</label>
                <input type="text" name="Contents"/>
            </div>
            <div className="field">
                <label>Fill:</label>
                <input type="boolean" name="fill"/>
            </div>
            <div className="field">
                <label>Fill Date:</label>
                <input type="datetime-local" name="fillDate"/>
            </div>
            <div className="field">
                <label>Current Phase:</label>
                <input type="text" name="currBrewPhase"/>
            </div>
            <div className="field">
                <label>Next Phase:</label>
                <input type="datetime-local" name="nextPhaseDate"/>
            </div>
        </form>
    </div>);
};

export default CreateTank;

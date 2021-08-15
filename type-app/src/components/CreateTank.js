import React from 'react';

const CreateTank = (props) => {


    const onFormSubmit = () => {

    }

    return (
        <div>
            <form>
                <div className="field">
                    <label>Name:</label>
                    <input type="text" name="name" placeholder={props.name ? props.name : ""}/>
                </div>
                <div className="field">
                    <label>Size:</label>
                    <input type="text" name="size" placeholder={props.size ? props.size : ""}/>
                </div>
                <div className="field">
                    <label>Contents:</label>
                    <input type="text" name="Contents" placeholder={props.contents ? props.contents : ""}/>
                </div>
                <div className="field">
                    <label>Fill:</label>
                    <input type="boolean" name="fill" placeholder={props.fill ? props.fill : ""}/>
                </div>
                <div className="field">
                    <label>Fill Date:</label>
                    <input type="datetime-local" name="fillDate" placeholder={props.fillDate ? props.fillDate : ""}/>
                </div>
                <div className="field">
                    <label>Current Phase:</label>
                    <input type="text" name="currPhase" placeholder={props.currPhase ? props.currPhase : ""}/>
                </div>
                <div className="field">
                    <label>Next Phase:</label>
                    <input type="text" name="nextPhase" placeholder={props.nextPhase ? props.nextPhase : ""}/>
                </div>
                <div className="field">
                    <label>Next Phase:</label>
                    <input type="datetime-local" name="currPhaseDate"
                           placeholder={props.currPhaseDate ? props.currPhaseDate : ""}/>
                </div>
                <input type="submit" value="Submit" onSubmit={onFormSubmit}/>
            </form>
        </div>
    );
};

export default CreateTank;

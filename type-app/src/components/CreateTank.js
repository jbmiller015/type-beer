import React from 'react';

const CreateTank = (currTank) => {
    return (<div>
        <form>
            <label>
                Name:
                <input type="text" name="name" />
            </label>
            <label>
                Size:
                <input type="text" name="size" />
            </label>
            <label>
                Contents:
                <input type="text" name="Contents" />
            </label>
            <label>
                Fill:
                <input type="boolean" name="fill" />
            </label>
            <label>
                Fill Date:
                <input type="datetime-local" name="fillDate" />
            </label>
            <label>
                Current Brew Phase:
                <input type="text" name="currBrewPhase" />
            </label>
            <label>
                Next Phase Date:
                <input type="datetime-local" name="nextPhaseDate" />
            </label>
            <input type="submit" value="Submit" />
        </form>
    </div>);
};

export default CreateTank;

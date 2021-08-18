import React, {useState} from 'react';
import typeApi from '../../api/type-server'
import Dropdown from "./Dropdown";


const CreateTank = (props) => {

    const [formData, setFormData] = useState({});


    const handleChange = e => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const onFormSubmit = async () => {
        try {
            const response = await typeApi.post('/tank', formData);
            console.log(response);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div>
            <form onSubmit={onFormSubmit}>
                <div className="field">
                    <label>Name:</label>
                    <input type="text" name="name" placeholder={props.name ? props.name : ""} onChange={handleChange}/>
                </div>
                <div className="field">
                    <label>Size:</label>
                    <input type="text" name="size" placeholder={props.size ? props.size : ""} onChange={handleChange}/>
                </div>
                <div className="field">
                    <Dropdown label="Select Tank Contents" options={}/>
                    <label>Contents:</label>
                    <input type="text" name="contents" placeholder={props.contents ? props.contents : ""}
                           onChange={handleChange}/>
                </div>
                <div className="field">
                    <label>Fill:</label>
                    <input type="boolean" name="fill" placeholder={props.fill ? props.fill : ""}
                           onChange={handleChange}/>
                </div>
                <div className="field">
                    <label>Fill Date:</label>
                    <input type="datetime-local" name="fillDate" placeholder={props.fillDate ? props.fillDate : ""}
                           onChange={handleChange}/>
                </div>
                <div className="field">
                    <label>Current Phase:</label>
                    <input type="text" name="currPhase" placeholder={props.currPhase ? props.currPhase : ""}
                           onChange={handleChange}/>
                </div>
                <div className="field">
                    <label>Next Phase:</label>
                    <input type="text" name="nextPhase" placeholder={props.nextPhase ? props.nextPhase : ""}
                           onChange={handleChange}/>
                </div>
                <div className="field">
                    <label>Next Phase:</label>
                    <input type="datetime-local" name="currPhaseDate"
                           placeholder={props.currPhaseDate ? props.currPhaseDate : ""} onChange={handleChange}/>
                </div>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    );
};

export default CreateTank;

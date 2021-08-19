import React, {useState} from 'react';
import typeApi from '../../api/type-server'


const CreateBeer = (props) => {

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
            const response = await typeApi.post('/beer', formData);
            console.log(response);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div>
            <form className="ui form" onSubmit={onFormSubmit}>
                <div className="field">
                    <label>Name:</label>
                    <input type="text" name="name" placeholder={props.name ? props.name : ""} onChange={handleChange}/>
                </div>
                <div className="field">
                    <label>Type:</label>
                    <input type="text" name="type" placeholder={props.type ? props.type : ""} onChange={handleChange}/>
                </div>
                <div className="field">
                    <label>Image:</label>
                    <input type="file" id="avatar" name="image" accept="image/png, image/jpeg"
                           placeholder={props.image ? props.image : null}
                           onChange={handleChange}/>
                </div>
                <div className="field">
                    <label>Description:</label>
                    <input type="text" name="desc" placeholder={props.desc ? props.desc : ""}
                           onChange={handleChange}/>
                </div>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    );
};

export default CreateBeer;

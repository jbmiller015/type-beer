import React, {useState} from 'react';
import typeApi from '../../api/type-server'
import NavComponent from "../NavComponent";
import {useHistory} from "react-router-dom";


const CreateBeer = (props) => {

    const [formData, setFormData] = useState({});
    const history = useHistory();


    const handleChange = e => {
        const {name, files, value} = e.target;
        if (name === "image") {
            console.log(files[0]);
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);

            reader.addEventListener("load", () => {
                setFormData(prevState => ({
                    ...prevState,
                    [name]: reader.result
                }));
            })
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)

        await typeApi.post('/beer', formData)
            .then(res =>
                history.push("/"))
            .catch(err => {
                console.error(err)
            });
    }

    return (
        <div>
            <NavComponent/>
            <form className="ui form" onSubmit={onFormSubmit}>
                <div className="field">
                    <label>Name:</label>
                    <input type="text" name="name" placeholder={props.name ? props.name : ""} onChange={handleChange}/>
                </div>
                <div className="field">
                    <label>Style:</label>
                    <input type="text" name="style" placeholder={props.style ? props.style : ""}
                           onChange={handleChange}/>
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

import React from 'react';
import typeApi from '../../api/type-server'
import NavComponent from "../NavComponent";


class CreateBeer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            style: "",
            image: "",
            desc: ""
        }
    }

    onFormSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name: this.state.name,
            style: this.state.style,
            image: this.state.image,
            desc: this.state.desc
        }


        await typeApi.post('/beer', formData)
            .then(res =>
                this.props.history.push('/'))
            .catch(err => {
                console.error(err)
            });
    }


    handleChange = e => {
        const {name, files, value} = e.target;
        if (name === "image") {
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.addEventListener("load", () => {
                this.setState({
                    [name]: reader.result
                })
            })
        } else {
            this.setState({
                [name]: value
            })
        }
    };

    render() {
        return (
            <div>
                <NavComponent/>
                <form className="ui form" onSubmit={this.onFormSubmit}>
                    <div className="field">
                        <label>Name:</label>
                        <input type="text" name="name" placeholder={this.props.name ? this.props.name : ""}
                               onChange={this.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Style:</label>
                        <input type="text" name="style" placeholder={this.props.style ? this.props.style : ""}
                               onChange={this.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Image:</label>
                        <input type="file" id="avatar" name="image" accept="image/png, image/jpeg"
                               placeholder={this.props.image ? this.props.image : null}
                               onChange={this.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Description:</label>
                        <input type="text" name="desc" placeholder={this.props.desc ? this.props.desc : ""}
                               onChange={this.handleChange}/>
                    </div>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        );
    }
}


export default CreateBeer;

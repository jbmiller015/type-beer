import React from 'react';
import typeApi from '../../api/type-server'
import Dropdown from "./Dropdown";


class CreateTank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            size: "",
            contents: {},
            fill: false,
            fillDate: "",
            currPhase: "",
            nextPhase: "",
            currPhaseDate: "",
            selectedBeer: ""
        }
    }


    setContents = content => {
        this.setState({contents: content, selectedBeer: content.name});
        console.log(this.state.contents)
    }

    handleChange = e => {
        const {name, value} = e.target;
        this.setState({
            [name]: value
        })
        console.log(this.state)
    };

    onFormSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name: this.state.name,
            size: this.state.size,
            contents: this.state.contents,
            fill: this.state.fill,
            fillDate: this.state.fillDate,
            currPhase: this.state.currPhase,
            nextPhase: this.state.nextPhase,
            currPhaseDate: this.state.currPhaseDate,
        }


        await typeApi.post('/tank', formData)
            .then(res =>
                this.props.history.push('/'))
            .catch(err => {
                console.error(err)
            });


    };

    render() {
        return (
            <div>
                <form className="ui form" onSubmit={this.onFormSubmit}>
                    <div className="field">
                        <label>Name:</label>
                        <input type="text" name="name" placeholder={this.props.name ? this.props.name : ""}
                               onChange={this.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Size:</label>
                        <input type="text" name="size" placeholder={this.props.size ? this.props.size : ""}
                               onChange={this.handleChange}/>
                    </div>
                    <div className="field">
                        <Dropdown label="Select Tank Contents"
                                  selected={this.state.contents}
                                  onSelectedChange={this.setContents}/>
                    </div>
                    <div className="field">
                        <label>Fill:</label>
                        <input type="boolean" name="fill" placeholder={this.props.fill ? this.props.fill : ""}
                               onChange={this.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Fill Date:</label>
                        <input type="datetime-local" name="fillDate"
                               placeholder={this.props.fillDate ? this.props.fillDate : ""}
                               onChange={this.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Current Phase:</label>
                        <input type="text" name="currPhase"
                               placeholder={this.props.currPhase ? this.props.currPhase : ""}
                               onChange={this.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Next Phase:</label>
                        <input type="text" name="nextPhase"
                               placeholder={this.props.nextPhase ? this.props.nextPhase : ""}
                               onChange={this.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Next Phase:</label>
                        <input type="datetime-local" name="currPhaseDate"
                               placeholder={this.props.currPhaseDate ? this.props.currPhaseDate : ""}
                               onChange={this.handleChange}/>
                    </div>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        );
    }
}

export default CreateTank;

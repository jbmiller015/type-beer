import React from 'react';
import typeApi from '../../api/type-server'
import Dropdown from "./Dropdown";
import NavComponent from "../NavComponent";


class CreateTank extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            size: "",
            contents: null,
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
    }

    handleChange = e => {
        const {name, value} = e.target;
        this.setState({
            [name]: value
        })
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

    //TODO:Adjust components to center
    render() {
        return (
            <div>
                <NavComponent tanks={false}/>
                <div className="container"
                     style={{display: "flex", flexDirection: "row", flexWrap: "wrap", paddingLeft: "1%"}}>
                    <div className="form" style={{paddingRight: "30%"}}>
                        <form className="ui form" onSubmit={this.onFormSubmit}>
                            <div className="field">
                                <label>Name:</label>
                                <input type="text" name="name" onChange={this.handleChange}/>
                            </div>
                            <div className="field">
                                <label>Size:</label>
                                <input type="text" name="size" onChange={this.handleChange}/>
                            </div>
                            <div className="field">
                                <Dropdown label="Select Tank Contents"
                                          onSelectedChange={this.setContents}
                                          url="beer"/>
                            </div>
                            <div className="field">
                                <label>Fill:</label>
                                <input type="boolean" name="fill" onChange={this.handleChange}/>
                            </div>
                            <div className="field">
                                <label>Fill Date:</label>
                                <input type="datetime-local" name="fillDate" onChange={this.handleChange}/>
                            </div>
                            <div className="field">
                                <label>Current Phase:</label>
                                <input type="text" name="currPhase" onChange={this.handleChange}/>
                            </div>
                            <div className="field">
                                <label>Next Phase:</label>
                                <input type="text" name="nextPhase" onChange={this.handleChange}/>
                            </div>
                            <div className="field">
                                <label>Next Phase:</label>
                                <input type="datetime-local" name="currPhaseDate" onChange={this.handleChange}/>
                            </div>
                            <input type="submit" value="Submit"/>
                        </form>
                    </div>
                    {this.state.contents ?
                        <div className="ui card">
                            <div className="ui basic top attached label" style={{zIndex: "1"}}>Tank Contents:</div>
                            <div className="image">
                                <img src={this.state.contents.image}/>
                            </div>
                            <div className="content">
                                <div className="header">{this.state.contents.name}</div>
                                <div className="meta">{this.state.contents.style}</div>
                                <div className="description">{this.state.contents.desc}</div>
                            </div>
                        </div>
                        : null}
                </div>
            </div>
        );
    }
}

export default CreateTank;

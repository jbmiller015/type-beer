import React from 'react';
import typeApi from '../../api/type-server'
import Dropdown from "./Dropdown";
import NavComponent from "../NavComponent";
import Beer from "../Beer/Beer";
import Tank from "./Tank";


class CreateTank extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            size: "",
            contents: null,
            fill: true,
            fillDate: "",
            currPhase: "",
            nextPhase: "",
            currPhaseDate: "",
            selectedBeer: "",
            showExample: false
        }
    }


    setContents = content => {
        this.setState({contents: content, selectedBeer: content.name});
    }

    handleChange = e => {
        let {name, value, checked} = e.target;
        if (name === "fill") {
            value = checked
        }
        this.setState({
            [name]: value,
            showExample: true
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
                <div className="ui horizontal divider"/>
                <div className="container"
                     style={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center"}}>
                    <div className="form" style={{padding: "2%"}}>
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
                                <div className="ui checkbox">
                                    <input type="checkbox" name="fill" tabIndex="0"
                                           onChange={this.handleChange}
                                           defaultChecked={this.state.fill}/>
                                    <label>Filled</label>
                                </div>
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
                            <button className="ui button" type="submit">Submit</button>
                        </form>
                    </div>
                    <div className={"example"} style={{paddingInline: "2%", paddingTop: "2%"}}>
                        {this.state.contents || this.state.showExample ?
                            <Tank tankData={this.state}
                                  detailButtonVisible={false}/>
                            : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateTank;

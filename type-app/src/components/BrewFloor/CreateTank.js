import React from 'react';
import typeApi from '../../api/type-server'
import Dropdown from "../Fields/Dropdown";
import Phase from "../Process/Phase";
import NavComponent from "../NavComponent";
import Tank from "./Tank";


class CreateTank extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            name: "",
            size: "",
            tankType: "",
            contents: null,
            fill: false,
            fillDate: "",
            phases: [],
            selectedBeer: "",
            showExample: false,
            typeDropDown: false
        }
    }


    setContents = async content => {
        this.setState({contents: content._id, selectedBeer: content.name});
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

    handleFieldChange = (index, e) => {
        let {name, value, checked} = e.target;
        if (name === "complete") {
            value = checked
        }
        let phases = [...this.state.phases];
        let phase = phases[index];
        phase[name] = value
        phases[index] = phase;
        this.setState({phases})
    }

    onFormSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name: this.state.name,
            size: this.state.size,
            contents: this.state.contents,
            fill: this.state.fill,
            fillDate: this.state.fillDate,
            phases: this.state.phases
        }


        await typeApi.post('/tank', formData)
            .then(res =>
                this.props.history.push('/'))
            .catch(err => {
                console.error(err)
            });


    };

    fillDateField = () => {
        return this.state.fill ?
            <div className="field">
                <label>Fill Date:</label>
                <input type="datetime-local" name="fillDate" onChange={this.handleChange}/>
            </div> : null
    }

    contentField = () => {
        return this.state.fill ?
            <div className="field">
                <Dropdown label="Select Tank Contents" onSelectedChange={this.setContents} url="beer"/>
            </div> : null
    }

    phaseFields = () => {
        return this.state.phases.map((phase, i) => {
            return <Phase phaseData={phase} key={i} index={i} handleChange={this.handleFieldChange}
                          removePhase={this.removePhase}/>
        });
    }

    phaseButton = () => {
        return this.state.contents && this.state.fill ?
            <div className="phase button" style={{alignItems: 'center', justifyContent: "center", display: 'flex'}}>
                <button className="ui primary button" onClick={this.addPhase}>
                    Add Phase
                </button>
            </div> : null
    }

    addPhase = (e) => {
        e.preventDefault()
        this.setState({phases: [...this.state.phases, {}]})
    }

    removePhase = (index, e) => {
        e.preventDefault();
        let phases = [...this.state.phases];
        phases.splice(index, 1);
        this.setState({phases});
    }

    render() {
        return (
            <div>
                <NavComponent tanks={false}/>
                <div className="ui horizontal divider"/>
                <div className="container"
                     style={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center"}}>
                    <div className="form" style={{padding: "2%"}}>
                        <form className="ui form" onSubmit={this.onFormSubmit}>
                            <div className="required field">
                                <label>Tank Name:</label>
                                <input type="text" name="name" onChange={this.handleChange}/>
                            </div>
                            <div className="required field">
                                <label>Tank Size:</label>
                                <input type="text" name="size" onChange={this.handleChange}/>
                            </div>
                            <div className="required field">
                                <label>Tank Type:</label>
                                <select className="ui dropdown" onChange={this.handleChange}>
                                    <option defaultValue="" hidden>Choose Type</option>
                                    <option value="brite">Brite</option>
                                    <option value="fermenter">Fermenter</option>
                                    <option value="kettle">Kettle</option>
                                </select>
                            </div>
                            <div className="field">
                                <div className="ui checkbox">
                                    <input type="checkbox" name="fill" tabIndex="0"
                                           onChange={this.handleChange}
                                           defaultChecked={this.state.fill}/>
                                    <label>Filled</label>
                                </div>
                            </div>
                            {this.fillDateField()}
                            {this.contentField()}
                            {this.phaseFields()}
                            {this.phaseButton()}
                            <button className="ui button" type="submit">Submit</button>
                        </form>
                    </div>
                    <div className={"example"} style={{paddingInline: "2%", paddingTop: "2%"}}>
                        {this.state.fill || this.state.showExample ?
                            <Tank tankData={{name: this.state.name, contents: {name: this.state.selectedBeer}}}
                                  detailButtonVisible={false}/>
                            : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateTank;

import React from 'react';
import typeApi from '../../api/type-server'
import Dropdown from "../Fields/Dropdown";
import Phase from "../Fields/Phase";
import Tank from "../BrewFloor/Tank";
import NavComponent from "../NavComponent";


class CreateProcess extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            name: "",
            exceptedYield: "",
            actualYield: "",
            contents: null,
            startDate: null,
            endDate: null,
            phases: [],
            selectedBeer: "",
            showExample: false,
            typeDropDown: false,
            showDefault: false
        }

    }


    screenSize = () => {
        if (window.innerWidth < 500) {
            return "90%"
        }
        if (window.innerWidth >= 500 && window.innerWidth < 1050) {
            return "60%"
        } else {
            return "30%"
        }
    }


    setContents = async content => {
        this.setState({contents: content._id, selectedBeer: content.name});
    }

    handleDropdownChange = data => {
        const {index} = data;
        if (index !== undefined) {
            this.handleFieldChange(index, data);
        } else {
            this.handleChange(data)
        }

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
        phases[index] = value;
        this.setState({phases});
    }

    validatePhase = (phase) => {
        let result = {
            valid: true,
            message: {
                fields: [],
                error: ""
            }
        }

        const checkObjs = () => {
            for (let el in phase) {
                if (!phase[el]) {
                    result.message.fields.push(el);
                    result.message.error = "Missing value in required field: " + el;
                    result.valid = false;
                }
            }
            return result.valid;
        }
        //Check Required Fields

        if (!checkObjs()) {
            return result;
        }

        const {phaseName, startDate, endDate, startTank, endTank} = phase;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start > end) {
            return {
                valid: false,
                message: "false"
            }
        } else
            return {
                valid: true,
                message: "true"
            }
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

    startDateField = () => {
        return (
            <div className="field">
                <label>Start Date:</label>
                <input type="date" name="startDate"
                       onChange={(e) => this.setState({startDate: e.target.value})}/>
            </div>
        );
    }
    endDateField = () => {
        return (
            <div className="field">
                <label>End Date:</label>
                <input type="date" name="endDate"
                       onChange={(e) => this.setState({endDate: e.target.value})}/>
            </div>
        );
    }

    contentField = () => {
        return (
            <div className="field">
                <Dropdown label="Select Tank Contents" onSelectedChange={this.setContents} url="beer"
                          target={'contents'}/>
            </div>
        );
    }

    phaseFields = () => {
        return this.state.phases.map((phase, i) => {
            return <Phase
                phaseData={{
                    phase,
                    previousPhase: i > 0 ? this.state.phases[i - 1] : null,
                    startDate: i > 0 ? null : this.state.startDate
                }}
                key={i} index={i}
                handleFieldChange={this.handleFieldChange}
                removePhase={this.removePhase}
                validatePhase={this.validatePhase}
            />
        });
    }

    phaseButton = () => {
        if (this.state.phases.length > 0 && !this.state.endDate) {
            return (<div className="field">
                <div className="phase button" style={{alignItems: 'center', justifyContent: "center", display: 'flex'}}>
                    <div className="ui primary button" onClick={this.addPhase}>
                        Add Phase
                    </div>
                </div>
            </div>);
        } else if (!this.state.contents || !this.state.startDate) {
            return null
        } else if (this.state.phases.length === 0 && !this.state.showDefault) {
            return (<div className="choice">
                <div className="field">
                    <div className="basic phase button"
                         style={{alignItems: 'center', justifyContent: "center", display: 'flex'}}>
                        <div className="ui primary button" onClick={(e => {
                            this.setState({showDefault: true})
                        })}>
                            Basic Brew
                        </div>
                    </div>
                </div>
                <div className="ui horizontal divider">
                    Or
                </div>
                <div className="field">
                    <div className="phase button"
                         style={{alignItems: 'center', justifyContent: "center", display: 'flex'}}>
                        <div className="ui primary button" onClick={this.addPhase}>
                            Add Phase
                        </div>
                    </div>
                </div>
            </div>)
        }


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

    defaultPhase = () => {
        if (this.state.showDefault) {
            this.state.phases.push({
                phaseName: `Standard Brew: ${this.state.selectedBeer}`,
                startDate: this.state.startDate,
                endDate: this.state.endDate
            })
            return (
                <div>
                    {this.endDateField()}
                    <div className={"field"}>
                        <Dropdown label="Select Start Tank" defaultTerm={""}
                                  onSelectedChange={(tank) => {
                                      this.handleFieldChange(0, {target: {name: 'startTank', value: tank}})
                                  }}
                                  url="tank"
                                  index={0}
                                  target={'startTank'}/>
                    </div>
                </div>

            )
        } else return null
    }

    phaseCollection = () => {
        return this.state.phases.length >= 1 && !this.state.showDefault ?
            <div className={"phases"} style={{padding: "1%", minWidth: this.screenSize()}}>
                <div className="form" style={{padding: "2%"}}>
                    <form className="ui form">
                        {this.phaseFields()}
                        {this.state.phases.length > 0 && !this.state.endDate ? this.phaseButton() : null}
                    </form>
                </div>
            </div> : null
    }

    render() {
        return (
            <div>
                <NavComponent tanks={false}/>
                <div className="ui horizontal divider"/>
                <div className="container"
                     style={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center"}}>
                    <div className="form" style={{padding: "1%", minWidth: this.screenSize()}}>
                        <form className="ui form" onSubmit={this.onFormSubmit}>
                            <div className="required field">
                                <label>Process Name:</label>
                                <input type="text" name="name" onChange={this.handleChange}/>
                            </div>
                            <div className="required field">
                                <label>Expected Yield:</label>
                                <input type="text" name="expectedYield" onChange={this.handleChange}/>
                            </div>
                            <div className="disabled field">
                                <label>Actual Yield:</label>
                                <input type="text" name="actualYield" onChange={this.handleChange}/>
                            </div>
                            {this.contentField()}
                            {this.startDateField()}
                            {!this.state.endDate && this.state.phases.length < 1 ? this.phaseButton() : null}
                            {this.defaultPhase()}
                            <button className="ui button" type="submit">Submit</button>
                        </form>
                    </div>
                    {this.phaseCollection()}
                </div>
            </div>
        );
    }
}

export default CreateProcess;

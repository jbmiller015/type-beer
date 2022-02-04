import React from 'react';
import typeApi from '../../api/type-server'
import Dropdown from "../Fields/Dropdown";
import PhaseField from "./PhaseField";
import Tank from "../BrewFloor/Tank";
import NavComponent from "../NavComponent";


class CreateProcess extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            name: "",
            expectedYield: "",
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
        if (this.state.showDefault) {
            phases[index][name] = value;
            if (name === 'startTank')
                phases[index].endTank = value;
        } else {
            phases[index] = value;
        }
        this.setState({phases});
    }

    validatePhase = (phase) => {
        let result = {
            valid: true,
            error: {
                fields: [],
                messages: []
            }
        }
        const checkObjs = () => {
            for (let el in phase) {
                if (!phase[el]) {
                    result.error.fields.push(el);
                    result.error.messages.push("Missing value in required field: " + el);
                    result.valid = false;
                }
            }
        }
        const {startDate, endDate, startTank, endTank} = phase;
        const checkDates = () => {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (start > end) {
                result.valid = false;
                result.error.fields.push("startDate");
                result.error.fields.push("endDate");
                result.error.messages.push("End Date Cannot be before Start Date");
            }
        }

        checkObjs();
        checkDates();
        return result;
    }

    onFormSubmit = async (e) => {
        e.preventDefault();

        console.log(this.state);
        const formData = {
            name: this.state.name,
            exceptedYield: this.state.exceptedYield,
            actualYield: this.state.actualYield,
            startDate: this.state.startDate,
            endDate: this.state.endDate ? this.state.endDate : this.state.phases[this.state.phases.length - 1].endDate,
            contents: this.state.contents,
            phases: this.state.phases
        }


        await typeApi.post('/process', formData)
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
                       onChange={(e) => {
                           this.setState({endDate: e.target.value});
                           this.handleFieldChange(0, {target: {name: 'endDate', value: e.target.value}})
                       }}/>
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
        console.log(this.state.phases)
        return this.state.phases.map((phase, i) => {
            return <PhaseField
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
        const size = this.state.phases.length;
        console.log(this.state.phases.length)
        if (this.state.phases.length >= 1) {
            console.log(this.state.phases[size - 1])
            const newPhase = {
                startDate: this.state.phases[size - 1].endDate,
                startTank: this.state.phases[size - 1].endTank,
                endTank: this.state.phases[size - 1].endTank
            }
            this.setState({
                phases: [...this.state.phases, newPhase]
            })
        } else {
            this.setState({phases: [...this.state.phases, {startDate: this.state.startDate}]})
        }
    }

    removePhase = (index, e) => {
        e.preventDefault();
        let phases = [...this.state.phases];
        phases.splice(index, 1);
        this.setState({phases});
    }

    defaultPhase = () => {
        if (this.state.showDefault) {
            if (this.state.phases.length < 1) {
                this.state.phases.push({
                    phaseName: `Standard Brew: ${this.state.selectedBeer}`,
                    startDate: this.state.startDate
                })
            }
            console.log(this.state.phases)
            return (
                <div>
                    {this.endDateField()}
                    <div className={"field"}>
                        {this.state.endDate ? <Dropdown label="Select Start Tank" defaultTerm={""}
                                                        onSelectedChange={(tank) => {
                                                            this.handleFieldChange(0, {
                                                                target: {
                                                                    name: 'startTank',
                                                                    value: tank._id
                                                                }
                                                            })
                                                        }}
                                                        url="tank"
                                                        index={0}
                                                        startDate={this.state.startDate}
                                                        endDate={this.state.endDate}
                                                        target={'startTank'}/> : null}
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

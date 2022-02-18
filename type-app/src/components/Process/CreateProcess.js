import React from 'react';
import typeApi from '../../api/type-server'
import Dropdown from "../Fields/Dropdown";
import PhaseField from "./PhaseField";
import Tank from "../BrewFloor/Tank";
import NavComponent from "../NavComponent";
import moment from "moment";
import CreateDuplicateProcess from "./CreateDuplicateProcess";
import CreateBasicProcess from "./CreateBasicProcess";
import CreateCustomProcess from "./CreateCustomProcess";


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
            selectedContents: "",
            showExample: false,
            typeDropDown: false,
            showCustomProcess: false,
            showDefault: false,
            showCopyProcess: false,
            copyProcess: null
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
        console.log(content)
        this.setState({contents: content._id, selectedContents: content.name});
    }

    setDuplicateProcess = process => {
        console.log(process)
        this.setState({copyProcess: process, showCopyProcess: true});
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
        } else if (name === "submit" && value.phaseName === "Transfer") {
            phases[index] = value;
            for (let i = index; i < phases.length; i++) {
                phases[i].startTank = value.endTank
                phases[i].endTank = value.endTank
            }
        } else if (name === "submit" && this.state.showCopyProcess && index === 0) {
            phases[index] = value;
            //{phaseName, startDate, endDate, startTank, endTank}
            phases.forEach((phase) => {
                //TODO:FIX - transfer phases showing up as {Transfer:""}
                if (phase.phaseName !== "Transfer") {
                    phase.startTank = value.startTank
                    phase.endTank = value.startTank
                }
            })
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

        //checkObjs();
        checkDates();
        return result;
    }

    onFormSubmit = async (phases, endDate) => {
        const formData = {
            name: this.state.name,
            expectedYield: this.state.expectedYield,
            actualYield: this.state.actualYield,
            startDate: this.state.startDate,
            endDate,
            contents: this.state.contents,
            phases: phases
        }

        await typeApi.post('/process', formData)
            .then(res =>
                this.props.history.push('/processes'))
            .catch(err => {
                console.error(err)
            });
    };

    startDateField = () => {
        return (
            <div className="required field">
                <label>Start Date:</label>
                <input type="date" name="startDate"
                       onChange={(e) => this.setState({startDate: e.target.value})}/>
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


    phaseButton = () => {
        if (!this.state.contents || !this.state.startDate) {
            return null;
        } else if (!this.state.showCustomProcess && !this.state.showDefault && !this.state.showCopyProcess) {
            return (<div className="choice">
                <div className="field">
                    <div className="basic phase button"
                         style={{alignItems: 'center', justifyContent: "center", display: 'flex'}}>
                        <div className="ui primary button" style={{maxWidth: "142px", minWidth: "142px"}}
                             onClick={(e => {
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
                        <div className="ui primary button" style={{maxWidth: "143px", minWidth: "142px"}}
                             onClick={() => {
                                 this.setState({showCustomProcess: true})
                             }}>
                            Custom Process
                        </div>
                    </div>
                </div>
                <div className="ui horizontal divider">
                    Or
                </div>
                <div className="field">
                    <div className="field">
                        <Dropdown label="Select Process to Copy" onSelectedChange={this.setDuplicateProcess}
                                  url="process"
                                  target={'process'}/>
                    </div>
                </div>
            </div>)
        }


    }


    //TODO:Add estimated end date field

    render() {
        return (
            <div>
                <NavComponent tanks={false}/>
                <div className="ui horizontal divider"/>
                <div className="container"
                     style={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center"}}>
                    <div className="form" style={{padding: "1%", minWidth: this.screenSize()}}>
                        <form className="ui form" onSubmit={this.onFormSubmit}>
                            <div className={"ui horizontal divider"}/>
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
                            {this.state.phases.length < 1 ? this.phaseButton() : null}
                            {this.state.showDefault ? <CreateBasicProcess selectedContents={this.state.selectedContents}
                                                                          startDate={this.state.startDate}
                                                                          onSubmit={(phases, endDate) => this.onFormSubmit(phases, endDate)}/> : null}
                        </form>
                    </div>
                    {this.state.showCopyProcess ?
                        <CreateDuplicateProcess process={this.state.copyProcess}
                                                startDate={this.state.startDate}
                                                onSubmit={(phases, endDate) => this.onFormSubmit(phases, endDate)}/> : null}
                    {this.state.showCustomProcess ? <CreateCustomProcess contents={this.state.contents}
                                                                         startDate={this.state.startDate}
                                                                         validatePhase={this.validatePhase}
                                                                         onSubmit={(phases, endDate) => this.onFormSubmit(phases, endDate)}/> : null}
                </div>
            </div>
        );
    }
}

export default CreateProcess;

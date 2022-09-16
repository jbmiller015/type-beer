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
import ProcessNotes from "../Process/ProcessNotes";


class CreateEvent extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            name: "",
            startDate: null,
            endDate: null,
            details: null,
            eventType: null
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
            startDate: this.state.startDate,
            endDate,
            contents: this.state.contents,
            phases: phases
        }

        await typeApi.post('/event', formData)
            .then(res =>
                this.props.history.push('/events'))
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

    endDateField = () => {
        return (
            <div className="required field">
                <label>End Date:</label>
                <input type="date" name="startDate"
                       onChange={(e) => this.setState({startDate: e.target.value})}/>
            </div>
        );
    }

    textField = (label, inputName, required = false) => {
        return (
            <div className={`${required ? "required" : ""} field`}>
                <label>{label}:</label>
                <input type="text" name={inputName} onChange={this.handleChange}/>
            </div>
        )
    }

    submitButton = () => {
        return (this.state.endDate && this.state.startDate && this.state.name) ?
            <div className="ui basic center aligned segment" style={{marginBottom: "3%"}}>
                <button className="ui green button" type="Submit" style={{
                    left: "0",
                    right: "0",
                    marginLeft: "auto",
                    marginRight: "auto"
                }}
                        onClick={() => this.onFormSubmit()}>Submit
                </button>
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
                            <div className={"ui horizontal divider"}/>
                            {this.textField("Event Name", "name", true)}
                            {this.startDateField()}
                            {this.endDateField()}
                            {this.textField("Event Type", "eventType", false)}
                            <ProcessNotes data={null} name={"details"} editable={true} handleProcessChange={this.handleChange}/>
                            {this.submitButton()}
                            </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateEvent;

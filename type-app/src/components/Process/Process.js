import React from 'react';
import typeApi from '../../api/type-server'
import Dropdown from "../Fields/Dropdown";
import Phase from "./Phase";
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

    getActive = async () => {
        return await typeApi.get('/process/active').then(response => {
            console.log(response.data)
            return response.data
        }, err => {
            console.log(err)
        });
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

        const formData = {
            name: this.state.name,
            exceptedYield: this.state.exceptedYield,
            actualYield: this.state.actualYield,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
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
        console.log(this.state.phases)
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
                Process
            </div>
        );
    }
}

export default CreateProcess;

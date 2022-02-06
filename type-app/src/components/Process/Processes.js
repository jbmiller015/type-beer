import React from 'react';
import typeApi from '../../api/type-server'
import Dropdown from "../Fields/Dropdown";
import PhaseField from "./PhaseField";
import Tank from "../BrewFloor/Tank";
import NavComponent from "../NavComponent";
import moment from "moment";
import Process from "./Process";


class CreateProcess extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            processes: {},
            activeProcesses: [],
            tanks: {},
            beers: {},
            tasks: [],
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

    async componentDidMount() {
        const procResults = await typeApi.get('/process').then(response => {
            const procObj = response.data.reduce((a, v, i) => ({
                ...a,
                [v._id]: v
            }), {})

            let tasks = {};
            let date = moment();
            for (let el in procObj) {
                for (let le of procObj[el].phases) {
                    let endDate = le.endDate.split("T", 1)[0];
                    if (date.startOf('day').isBetween(endDate, moment(endDate).endOf('day'), 'date', "[]")) {
                        tasks = {...tasks, [procObj[el].name]: {...le, processId: procObj[el]._id}}
                    }
                }
            }
            return {tasks, procObj};
        }, err => {
            this.setState(state => ({
                isLoaded: true,
                error: [...state.error, err.message]
            }))
        });
        const tanksResults = await typeApi.get(`/tank`).then(response => {
            return response.data.reduce((a, v, i) => ({
                ...a,
                [v._id]: v
            }), {})
        }, err => {
            this.setState(state => ({
                isLoaded: true,
                error: [...state.error, err.message]
            }))
        })
        const active = await typeApi.get('/process/active').then(response => {
            return response.data
        }, err => {
            console.log(err)
        });
        this.setState({
            tasks: procResults.tasks,
            processes: procResults.procObj,
            tanks: tanksResults,
            activeProcesses: active,
            isLoaded: true
        })
    }

    deleteProcess = (processId) => {
        typeApi.delete(`/process/${processId}`).then((res) => {
            let newState = {...this.state};
            delete newState.tanks[processId];
            this.setState(newState);
            window.location.reload();
            this.setState({infoMessage: "Deleted Process:" + processId})
        }).catch(err => {
            this.setState(state => ({
                error: [...state.error, err.message]
            }))
        })
    }

    getBeerById = async (beerId) => {
        const beer = this.state.beers[beerId] || await typeApi.get(`/beer/${beerId}`).then((res) => {
            return res.data[0];
        }).catch(err => {
            this.setState(state => ({
                error: [...state.error, err.message]
            }))
        })
        if (!this.state.beers[beerId]) {
            this.setState(state => ({
                beers: {...state.beers, [beerId]: beer}
            }))
        }
        return beer;
    }


    getTankDetails = (tankId) => {
        return this.state.tanks[tankId];
    }

    allProcesses = () => {
        return Object.values(this.state.processes).map((process) => {
            return <Process processData={process}
                            getTankDetails={(tankId) => this.getTankDetails(tankId)}
                            handleProcessChange={async (e, processId, phaseIndex) => {
                                await this.handleProcessChange(e, processId, phaseIndex)
                            }}
                            deleteProcess={(processId) => {
                                this.deleteProcess(processId)
                            }}
                            getBeerById={(beerId) => {
                                return this.getBeerById(beerId)
                            }}/>
        })
    }

    activeProcesses = () => {
        if (this.state.activeProcesses.length > 0) {
            return this.state.activeProcesses.map((process) => {
                let beer = this.getBeerById(process.contents)
                return <Process processData={process} beerData={beer}
                                getTankDetails={(tankId) => this.getTankDetails(tankId)}
                                handleProcessChange={async (e, processId, phaseIndex) => {
                                    await this.handleProcessChange(e, processId, phaseIndex)
                                }}
                                deleteProcess={(processId) => {
                                    this.deleteProcess(processId)
                                }}
                                getBeerById={(beerId) => {
                                    return this.getBeerById(beerId)
                                }}/>
            })
        } else
            return <div style={{
                left: "0",
                right: "0",
                marginLeft: "auto",
                marginRight: "auto"
            }}>Nothing going on ¯\_(ツ)_/¯</div>
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

    handleDropdownChange = data => {
        const {index} = data;
        if (index !== undefined) {
            this.handleFieldChange(index, data);
        } else {
            this.handleChange(data)
        }

    }

    handleProcessChange = async (e, processId, phaseIndex = null) => {
        let {name, value, checked} = e.target;
        if (name === "complete") {
            value = checked
        }
        let process = this.state.processes[processId]
        if (phaseIndex !== null) {
            process.phases[phaseIndex][name] = value
        } else {
            process[name] = value;
        }
        await typeApi.put(`/process/${processId}`, process).then((res) => {
            console.log(res.data)
            let newState = {...this.state};
            newState.processes[processId] = res.data;
            this.setState(newState);
        }).catch(err => {
            this.setState(state => ({
                error: [...state.error, err.message]
            }))
        })
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
                <div className={"ui horizontal divider"}/>
                <div style={{
                    maxWidth: "50%",
                    left: "0",
                    right: "0",
                    marginLeft: "auto",
                    marginRight: "auto"
                }}>
                    <div className={"ui large header"}>Active Processes</div>
                    <div className="ui relaxed divided items" style={{
                        borderStyle: "solid",
                        borderRadius: "2%",
                        borderWidth: "1px",
                        borderColor: "goldenrod",
                        padding: "2%"
                    }}>
                        {!this.state.isLoaded ?
                            <div className="ui active centered inline inverted dimmer">
                                <div className="ui big text loader">Loading</div>
                            </div> : this.activeProcesses()}
                    </div>
                </div>
                <div className={"ui horizontal divider"}/>
                <div style={{
                    maxWidth: "50%",
                    left: "0",
                    right: "0",
                    marginLeft: "auto",
                    marginRight: "auto"
                }}>
                    <div className={"ui large header"}>All Processes</div>
                    <div className="ui relaxed divided items" style={{
                        borderStyle: "solid",
                        borderRadius: "1%",
                        borderWidth: "1px",
                        borderColor: "lightgrey",
                        padding: "1%"
                    }}>
                        {this.allProcesses()}
                    </div>
                </div>
            </div>
        );
    }

}

export default CreateProcess;

import React from 'react';
import typeApi from '../../api/type-server'
import Dropdown from "../Fields/Dropdown";
import PhaseField from "./PhaseField";
import Tank from "../BrewFloor/Tank";
import NavComponent from "../NavComponent";
import moment from "moment";
import Process from "./Process";
import SearchFilter from "../Fields/SearchFilter";
import {filterEntries, formatDate, sortEntries} from "./ProcessFunctions";
import Message from "../Messages/Message";
import Beer from "../Beer/Beer";


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
            showDefault: false,
            showActive: true,
            showUpcoming: false,
            showOverdue: false,
            showAll: false,
            infoMessage: null,
            error: [],
            term: ''
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
                    if (date.startOf('date').isBetween(endDate, moment(endDate).endOf('date'), 'date', "[]")) {
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

    filterSort = (components) => {
        if (this.state.term.length) {
            console.log(this.state.term)
            try {
                components = filterEntries(this.state.term, null, components, (err) => {
                    if (!this.state.error.includes(err)) {
                        this.setState(state => ({
                            error: [...state.error, err]
                        }))
                    }
                }).map((process, i) => {
                    console.log(process)
                    let beer = this.getBeerById(process.contents)
                    return this.createProcess(process, beer)
                })
            } catch (err) {
                return null;
            }
        } else if (this.state.sorted) {
            console.log(this.state.sorted)
            console.log(this.state.sorted[0])
            console.log(this.state.sorted[1])
            components = sortEntries(this.state.sorted[0], this.state.sorted[1], components).map((process, i) => {
                let beer = this.getBeerById(process.contents)
                return this.createProcess(process, beer)
            })
        } else {
            return components.map((process) => {
                let beer = this.getBeerById(process.contents)
                return this.createProcess(process, beer)
            })
        }
        return components
    }

    createProcess = (process, beer) => {
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
    }

    allProcesses = () => {
        let all = this.filterSort(Object.values(this.state.processes));

        if (all.length > 0) {
            return all
        } else return (<div style={{
            left: "0",
            right: "0",
            marginLeft: "auto",
            marginRight: "auto"
        }}>Nothing Planned ¯\_(ツ)_/¯</div>)
    }


    activeProcesses = () => {
        let active = this.state.activeProcesses
        active = this.filterSort(active)

        if (active && active.length > 0) {
            console.log(active)
            return active
        } else
            return <div style={{
                left: "0",
                right: "0",
                marginLeft: "auto",
                marginRight: "auto"
            }}>Nothing going on ¯\_(ツ)_/¯</div>
    }


    upcomingProcesses = () => {
        let upcoming = Object.values(this.state.processes).filter((process) => {
            let endDate = formatDate(process.startDate)
            return moment(endDate).isAfter(moment().startOf('date'));
        })
        upcoming = this.filterSort(upcoming)
        if (upcoming.length > 0) {
            return upcoming
        } else return (<div style={{
            left: "0",
            right: "0",
            marginLeft: "auto",
            marginRight: "auto"
        }}>Nothing coming up ¯\_(ツ)_/¯</div>)
    }

    overdueProcesses = () => {
        let overdue = Object.values(this.state.processes).filter((process) => {
            let endDate = formatDate(process.endDate)
            if (moment(endDate).isBefore(moment().startOf('date'))) {
                for (let el of process.phases) {
                    if (!el.complete) {
                        return true
                    }
                }
            }
            return false
        })
        overdue = this.filterSort(overdue)
        if (overdue.length > 0) {
            return overdue
        } else return (<div style={{
            left: "0",
            right: "0",
            marginLeft: "auto",
            marginRight: "auto"
        }}>Nothing left to do ¯\_(ツ)_/¯</div>)
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

    processCollection = (processes, color, header) => {
        return (<div style={{
            maxWidth: "50%",
            left: "0",
            right: "0",
            marginLeft: "auto",
            marginRight: "auto"
        }}>
            <div className={"ui horizontal divider"}/>
            <div className={"ui large header"}>{header}</div>
            <div className="ui relaxed divided items" style={{
                borderStyle: "solid",
                borderRadius: "1%",
                borderWidth: "1px",
                borderColor: color,
                padding: "2%"
            }}>
                {!this.state.isLoaded ?
                    <div className="ui active centered inline inverted dimmer">
                        <div className="ui big text loader">Loading</div>
                    </div> : processes}
            </div>
        </div>)
    }


    showCollection = () => {
        const {processes, isLoaded, error} = this.state

        let arr = [];
        if (this.state.showActive) {
            arr.push(this.processCollection(this.activeProcesses(), "goldenrod", "Active Processes"));
        }
        if (this.state.showUpcoming) {
            arr.push(this.processCollection(this.upcomingProcesses(), "green", "Upcoming Processes"));
        }
        if (this.state.showOverdue) {
            arr.push(this.processCollection(this.overdueProcesses(), "palevioletred", "Overdue Processes"));
        }
        if (this.state.showAll) {
            arr.push(this.processCollection(this.allProcesses(), "lightgrey", "All Processes"));
        }


        if (!isLoaded) {
            return (
                <div className="ui active centered inline inverted dimmer">
                    <div className="ui big text loader">Loading</div>
                </div>
            );
        } else {
            let components;

            return arr
        }
    }

    setFilter = (e) => {
        switch (e.target.name) {
            case 'filterActive':
                this.setState({
                    showActive: !this.state.showActive
                })
                break
            case 'filterUpcoming':
                this.setState({
                    showUpcoming: !this.state.showUpcoming
                })
                break
            case 'filterOverdue':
                this.setState({
                    showOverdue: !this.state.showOverdue
                })
                break
            case 'filterAll':
                this.setState({
                    showAll: !this.state.showAll
                })
                break
            default:
                break
        }
    }

    setInfoMessage = (message) => {
        this.setState({infoMessage: message.infoMessage})
    }

    setErrorMessage = (message) => {
        this.setState(state => ({
            error: [...state.error, message.errorMessage]
        }))
    }

    render() {
        let errMessage = this.state.error.map((err, i) => {
            return (
                <Message key={i} messageType={'error'} onClose={() => this.setState({error: [], term: ''})}
                         message={err}/>
            )
        })
        return (
            <div>
                <NavComponent tanks={false}/>
                <div className={"ui horizontal divider"}/>
                {this.state.error.length > 0 ? errMessage : null}
                {this.state.infoMessage ? <Message messageType={'info'} message={this.state.infoMessage}
                                                   onClose={() => this.setState({infoMessage: null})}/> :
                    <div style={{marginTop: "3.55%"}} className="ui horizontal divider"/>}
                <SearchFilter page={"processes"} filterList={['Active', 'Upcoming', 'Overdue', 'All']}
                              setFilter={this.setFilter}
                              setMessage={(message) => this.setInfoMessage(message)}
                              handleChange={e => this.setState({term: e.target.value})} term={this.state.term}
                              setSorted={sorted => this.setState({sorted: sorted.sorted})}/>
                {this.showCollection()}
            </div>
        );
    }

}

export default CreateProcess;

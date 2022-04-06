import React from 'react';
import typeApi from '../../api/type-server'
import Dropdown from "../Fields/Dropdown";
import PhaseField from "./PhaseField";
import NavComponent from "../NavComponent";
import moment from "moment";
import Process from "./Process";
import SearchFilter from "../Fields/SearchFilter";
import {filterEntries, formatDate, sortEntries} from "./ProcessFunctions";
import Message from "../Messages/Message";
import ProcessCollection from "./ProcessCollection";
import Shrugger from "../Messages/Shrugger";


class Processes extends React.Component {


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
            term: '',
            sorted: null,
            showModal: false,
            newDateData: null,
            dateType: null
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

    handleProcessChange = async (e, processId, phaseIndex = null, dateChange = null) => {
        console.log(e)
        let {name, value, checked} = e.target;
        console.log("name: ", name)
        if (name === "complete") {
            value = checked
        }
        if (dateChange !== null) {
            let data;
            if (dateChange === "complex") {
                data = await this.complexDateChange(name, value, phaseIndex, processId).then(data => {
                    return data
                });
            } else {
                data = await this.simpleDateChange(name, value, phaseIndex, processId).then(data => {
                    return data
                });
            }
            console.log(data)
            return data
        } else {
            let process = this.state.processes[processId]
            if (phaseIndex !== null) {
                process.phases[phaseIndex][name] = value
            } else {
                process[name] = value;
            }
            return await this.putProcess(processId, process).then(data => {
                return data
            });
        }

    }

    simpleDateChange = async (name, value, phaseIndex, processId) => {
        let process = this.state.processes[processId]
        console.log(process)
        if (phaseIndex !== null) {
            if (name === 'endDate' && phaseIndex === process.phases.length - 1) {
                process[name] = value;
            }
            process.phases[phaseIndex][name] = value
        } else {
            process[name] = value;
            if (name === 'startDate') {
                process.phases[0].startDate = value;
            } else if (name === 'endDate') {
                process.phases[process.phases.length - 1].endDate = value;
            }
        }
        return await this.putProcess(processId, process).then((data) => {
            return data
        });
    }

    complexDateChange = async (name, value, phaseIndex, processId) => {
        console.log(name)
        console.log(phaseIndex)
        let process = this.state.processes[processId]
        console.log(process)
        let oldDate = phaseIndex === null ? process[name] : process.phases[phaseIndex][name];
        const diff = moment(formatDate(value)).diff(formatDate(oldDate), 'days')
        if (name === 'startDate' && phaseIndex === null) {
            process.startDate = value;
            for (let i = 0; i < process.phases.length; i++) {
                process = this.shiftStartDate(process, diff, i)
                if (i === process.phases.length - 1) {
                    process.endDate = process.phases[process.phases.length - 1].endDate
                }

            }
        } else if (name === 'endDate' && phaseIndex === null) {
            process.endDate = value;
            process.phases[process.phases.length - 1].endDate = value;
        } else if (phaseIndex !== null) {
            if (name === 'endDate' && phaseIndex === process.phases.length - 1) {
                process.endDate = value;
            }
            for (let i = phaseIndex; i < process.phases.length; i++) {
                process = this.shiftEndDate(process, diff, i)
                if (name === 'startDate' && i === 0) {
                    process.startDate = value;
                }
                if (i === process.phases.length - 1) {
                    process.endDate = process.phases[process.phases.length - 1].endDate;
                }
            }
        }
        return await this.putProcess(processId, process).then((data) => {
            return data
        });
    }

    shiftStartDate = (process, diff, index) => {
        let tempStartDate = new Date(process.phases[index].startDate)
        let tempEndDate = new Date(process.phases[index].endDate)
        let startResult = tempStartDate.setDate(tempStartDate.getDate() + diff);
        let endResult = tempEndDate.setDate(tempEndDate.getDate() + diff);
        process.phases[index].startDate = new Date(startResult).toISOString()
        process.phases[index].endDate = new Date(endResult).toISOString()
        return process
    }
    shiftEndDate = (process, diff, index) => {
        if (index + 1 < process.phases.length) {
            let tempStartDate = new Date(process.phases[index + 1].startDate)
            let tempEndDate = new Date(process.phases[index].endDate)
            let startResult = tempStartDate.setDate(tempStartDate.getDate() + diff);
            let endResult = tempEndDate.setDate(tempEndDate.getDate() + diff);
            process.phases[index + 1].startDate = new Date(startResult).toISOString()
            process.phases[index].endDate = new Date(endResult).toISOString()
        } else {
            let tempEndDate = new Date(process.phases[index].endDate)
            let endResult = tempEndDate.setDate(tempEndDate.getDate() + diff);
            process.phases[index].endDate = new Date(endResult).toISOString()
        }
        return process
    }

    putProcess = async (processId, process) => {
        const data = await typeApi.put(`/process/${processId}`, process).then((res) => {
            return res.data
        }).catch(err => {
            this.setState(state => ({
                error: [...state.error, err.message]
            }))
        })
        console.log(data)
        let newState = {...this.state};
        newState.processes[processId] = data;
        newState.showModal = false;
        this.setState(newState);
        return data;
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

    renderCollection = (processes, color, header, shruggerMessage) => {
        return <ProcessCollection processes={processes} color={color} header={header} shruggerMessage={shruggerMessage}
                                  filter={this.state.term !== "" ? {query: this.state.term} : null}
                                  sort={this.state.sorted !== null ? {
                                      key: this.state.sorted[0],
                                      direction: this.state.sorted[1]
                                  } : null}
                                  setError={this.setErrorMessage}
                                  getBeerById={(id) => this.getBeerById(id)}
                                  getTankDetails={(id) => this.getTankDetails(id)}
                                  deleteProcess={(id) => this.deleteProcess(id)}
                                  handleProcessChange={async (e, processId, phaseIndex, choice) => {
                                      return await this.handleProcessChange(e, processId, phaseIndex, choice).then(data => {
                                          return data
                                      })
                                  }}
        />
    }

    showActiveCollection = () => {
        let active = this.state.activeProcesses;
        if (!this.state.isLoaded) {
            return (
                <div className="ui active centered inline inverted dimmer">
                    <div className="ui big text loader">Loading</div>
                </div>
            );
        } else {
            return this.renderCollection(active, "goldenrod", "Active Processes", "Nothing going on")
        }
    }
    showAllCollection = () => {
        let all = Object.values(this.state.processes);
        return this.renderCollection(all, "lightgrey", "All Processes", "Nothing Planned")
    }
    showOverDueCollection = () => {
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

        return this.renderCollection(overdue, "palevioletred", "Overdue Processes", "Nothing left to do")

    }

    showUpcomingCollection = () => {
        let upcoming = Object.values(this.state.processes).filter((process) => {
            let endDate = formatDate(process.startDate)
            return moment(endDate).isAfter(moment().startOf('date'));
        })

        return this.renderCollection(upcoming, "green", "Upcoming Processes", "Nothing coming up")

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

    //TODO: Add Reset button to filterSort that sets term to '' and sort to null
    render() {
        console.log("render")
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
                              setSorted={sorted => this.setState({sorted: sorted.sorted})}
                              reset={() => {
                                  this.setState({term: '', sorted: null})
                              }}/>
                {this.state.showActive ? this.showActiveCollection() : null}
                {this.state.showUpcoming ? this.showUpcomingCollection() : null}
                {this.state.showOverdue ? this.showOverDueCollection() : null}
                {this.state.showAll ? this.showAllCollection() : null}
            </div>
        );
    }

}

export default Processes;

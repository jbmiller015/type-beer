import React from 'react';
import typeApi from '../../api/type-server'
import PhaseField from "./PhaseField";
import NavComponent from "../NavComponent";
import moment from "moment";
import SearchFilter from "../Fields/SearchFilter";
import {filterSort, formatDate} from "./ProcessFunctions";
import Message from "../Messages/Message";
import Process from "./Process";
import Shrugger from "../Messages/Shrugger";
import ProcessFilterButtons from "./ProcessFilterButtons";
import GoToCreate from "../Buttons/GoToCreate";


class Processes extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            processes: {},
            activeProcesses: [],
            allProcesses: [],
            overdueProcesses: [],
            upcomingProcesses: [],
            visible: [],
            shruggerMessage: "Nothing going on",
            activeView: "active",
            color: '#fbbd08',

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
            infoMessage: null,
            error: [],
            term: '',
            sorted: null,
            showModal: false,
            newDateData: null,
            dateType: null,
            width: window.innerWidth,
            height: window.innerHeight
        }
    }


    async componentDidMount() {
        let tank;
        let process;
        let activeProcess;
        let beer;
        if (localStorage.getItem('token').includes("demoToken")) {
            console.log("demotoken")
            tank = "/demo/tank";
            process = "/demo/process";
            activeProcess = "/demo/process";
            beer = "/demo/beer"
        } else {
            tank = "/tank";
            process = "/process"
            activeProcess = "/process/active"
            beer = "/beer"
        }
        const procResults = await typeApi.get(process).then(response => {
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
        const tanksResults = await typeApi.get(tank).then(response => {
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
        const active = await typeApi.get(activeProcess).then(response => {
            return response.data
        }, err => {
            console.log(err)
        });

        const overdue = Object.values(procResults.procObj).filter((process) => {
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

        const upcoming = Object.values(procResults.procObj).filter((process) => {
            let endDate = formatDate(process.startDate)
            return moment(endDate).isAfter(moment().startOf('date'));
        })

        const all = Object.values(procResults.procObj)

        this.setState({
            tasks: procResults.tasks,
            processes: procResults.procObj,
            tanks: tanksResults,
            activeProcesses: active,
            allProcesses: all,
            overdueProcesses: overdue,
            upcomingProcesses: upcoming,
            isLoaded: true,
            visible: active
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
        const beerUrl = localStorage.getItem('token').includes("demoToken") ? "/demo/beer":"/beer";

        const beer = this.state.beers[beerId] || await typeApi.get(`${beerUrl}/${beerId}`).then((res) => {
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
        let {name, value, checked} = e.target;
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

    /**
     * Handles date changes in custom processes.
     * Shifts changed and each subsequent date by calculated difference of new vs old date.
     *
     * @param name Start or End Date of process or phase.
     * @param value New date to replace old.
     * @param phaseIndex index of specific phase in process.
     * @param processId id of specific process.
     * @returns Put response from type-server api.
     */
    complexDateChange = async (name, value, phaseIndex, processId) => {
        let process = this.state.processes[processId]
        let oldDate = phaseIndex === null ? process[name] : process.phases[phaseIndex][name];
        const diff = moment(formatDate(value)).diff(formatDate(oldDate), 'days');

        //If changing a process start date. Update all phases in process.
        if (name === 'startDate' && phaseIndex === null) {
            process.startDate = value;
            for (let i = 0; i < process.phases.length; i++) {
                process = this.shiftStartDate(process, diff, i);
                if (i === process.phases.length - 1) {
                    process.endDate = process.phases[process.phases.length - 1].endDate;
                }

            }
            //If changing process end date. Update last phase end date.
        } else if (name === 'endDate' && phaseIndex === null) {
            process.endDate = value;
            process.phases[process.phases.length - 1].endDate = value;
            //If changing a phase date at phase index i. Update all phases from i : n.
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
            return data;
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
        const {startDate, endDate} = phase;
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


    phaseFields = () => {
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

    setInfoMessage = (message) => {
        this.setState({infoMessage: message.infoMessage})
    }

    setErrorMessage = (message) => {
        this.setState(state => ({
            error: [...state.error, message.errorMessage]
        }))
    }

    setVisible = (view, color) => {
        switch (view) {
            case "active":
                this.setState({
                    shruggerMessage: "Nothing going on", color, activeView: "active"
                })
                break;
            case "upcoming":
                this.setState({shruggerMessage: "Nothing coming up", color, activeView: "upcoming"})
                break;
            case "overdue":
                this.setState({shruggerMessage: "Nothing left to do", color, activeView: "overdue"})
                break;
            case "all":
                this.setState({shruggerMessage: "Nothing planned", color, activeView: "all"})
                break;
            default:
                break;
        }

    }

    //!Note: Each process component must have a UNIQUE key otherwise it WILL NOT unmount on view change.
    renderComponents = () => {
        let processes = [];
        if (this.state.activeView === "active") {
            processes = this.state.activeProcesses;
        } else if (this.state.activeView === "all") {
            processes = this.state.allProcesses
        } else if (this.state.activeView === "overdue") {
            processes = this.state.overdueProcesses
        } else if (this.state.activeView === "upcoming") {
            processes = this.state.upcomingProcesses
        }


        processes = filterSort(processes, this.state.term, this.state.sorted, this.setErrorMessage);


        if (this.state.error.length < 1 && processes && processes.length > 0) {
            return processes.map((process) => {
                let beer = this.getBeerById(process.contents)
                return <Process key={process._id} processData={process} beerData={beer}
                                getTankDetails={(tankId) => this.getTankDetails(tankId)}
                                handleProcessChange={async (e, processId, phaseIndex, choice) => {
                                    return await this.handleProcessChange(e, processId, phaseIndex, choice).then(data => {
                                        return data
                                    })
                                }}
                                deleteProcess={(processId) => {
                                    this.deleteProcess(processId)
                                }}
                                getBeerById={(beerId) => {
                                    return this.getBeerById(beerId)
                                }}/>
            })
        } else
            return <Shrugger message={this.state.shruggerMessage}/>
    }

    render() {
        let errMessage = this.state.error.map((err, i) => {
            return (
                <Message key={i} messageType={'error'} onClose={() => this.setState({error: [], term: ''})}
                         message={err}/>
            )
        })
        if (!this.state.isLoaded) {
            return (
                <div className="ui active centered inline inverted dimmer">
                    <div className="ui big text loader">Loading</div>
                </div>
            );
        } else
            return (

                <div>
                    <NavComponent tanks={false}/>
                    <div className={"ui horizontal divider"}/>
                    {this.state.error.length > 0 ? errMessage : null}
                    {this.state.infoMessage ? <Message messageType={'info'} message={this.state.infoMessage}
                                                       onClose={() => this.setState({infoMessage: null})}/> :
                        <div style={{marginTop: "3.55%"}} className="ui horizontal divider"/>}
                    {this.state.allProcesses ? <div>
                        <SearchFilter page={"processes"}
                                      setMessage={(message) => this.setInfoMessage(message)}
                                      handleChange={e => this.setState({term: e.target.value})} term={this.state.term}
                                      setSorted={sorted => this.setState({sorted: sorted.sorted})}
                                      reset={() => {
                                          this.setState({term: '', sorted: null, error: []})
                                      }}/>
                        <div className={"ui horizontal divider"}/>
                        <ProcessFilterButtons setView={(view, color) => {
                            this.setVisible(view, color)
                        }}/>
                        <div style={{
                            maxWidth: this.state.width > 415 ? "50%" : "90%",
                            left: "0",
                            right: "0",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}>
                            <div className={"ui horizontal divider"}/>
                            <div className="ui relaxed divided items" style={{
                                borderStyle: "solid",
                                borderRadius: "1%",
                                borderWidth: "1px",
                                borderColor: this.state.color,
                                padding: "2%"
                            }}>
                                {this.state.error.length < 1 ? this.renderComponents() :
                                    <Shrugger
                                        message={"Something went wrong.\nCheck the error message before continuing."}/>}
                            </div>
                        </div>
                    </div> : <GoToCreate destination={"process"}/>}
                </div>
            );
    }

}

export default Processes;

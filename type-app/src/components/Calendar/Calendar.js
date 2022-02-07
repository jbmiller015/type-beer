import React from "react";
import NavComponent from "../NavComponent";
import CalendarModal from "./CalendarModal";
import moment from 'moment'
import Date from "./Date";
import typeApi from "../../api/type-server";

class Calendar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            weekdayshort: moment.weekdaysShort(),
            processes: {},
            filteredProcesses: {},
            renderedProcesses: {},
            tanks: {},
            beers: {},
            tasks: [],
            colors: ['#FFF897', '#EDCF5C', '#f6c101', '#EC9D00', '#DF8D03', '#C96E12', '#9C5511', '#6F3B10', '#42220F', '#14080E'],
            prevMonth: -1,
            currMonth: 0,
            nextMonth: 1,
            prevWeek: -1,
            currWeek: 0,
            nextWeek: 1,
            monthViewActive: true,
            processViewActive: true,
            showModal: false,
            modalProcessId: null,
            modalTankId: null,
            modalDate: null,
            modalBeerData: null
        }
    }


    calModalData = async (processId, tankId, modalDate) => {
        const beer = await this.getBeerById(this.state.processes[processId].contents);
        this.setState({showModal: true, modalProcessId: processId, modalTankId: tankId, modalDate, modalBeerData: beer})
    }

    closeModal = () => {
        this.setState({showModal: false, modalProcessId: null, modalTankId: null, modalDate: null})
    }

    async componentDidMount() {
        const procResults = await typeApi.get('/process').then(response => {
            const procObj = response.data.reduce((a, v, i) => ({
                ...a,
                [v._id]: {...v, color: this.state.colors[(i % 10 + 10) % 10]}
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
        this.setState({tasks: procResults.tasks, processes: procResults.procObj, tanks: tanksResults, isLoaded: true})
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


    setMonth = (direction) => {
        if (direction === 'prev') {
            this.setState((prev) => ({
                prevMonth: prev.prevMonth - 1,
                currMonth: prev.currMonth - 1,
                nextMonth: prev.nextMonth - 1,
            }))
        } else {
            this.setState((prev) => ({
                prevMonth: prev.prevMonth + 1,
                currMonth: prev.currMonth + 1,
                nextMonth: prev.nextMonth + 1,
            }))
        }
    }

    setWeek = (direction) => {
        if (direction === 'prev') {
            this.setState((prev) => ({
                prevWeek: prev.prevWeek - 1,
                currWeek: prev.currWeek - 1,
                nextWeek: prev.nextWeek - 1,
            }))
        } else {
            this.setState((prev) => ({
                prevWeek: prev.prevWeek + 1,
                currWeek: prev.currWeek + 1,
                nextWeek: prev.nextWeek + 1,
            }))
        }
    }


    weekdayShortName = () => {
        return this.state.weekdayshort.map(day => {
            return (
                <div className={"column"} key={day}>
                    <h4>{day}</h4>
                </div>
            );
        });
    }

    getPhasesByDate = (date) => {
        const rendered = Object.keys(this.state.renderedProcesses).length > 0 ? this.state.renderedProcesses : this.state.processes;
        return Object.values(rendered).filter(process => {
            let startDate = process.startDate.split("T", 1)[0];
            let endDate = process.endDate.split("T", 1)[0];
            return (date.startOf('date').isBetween(moment(startDate).startOf('date'), moment(endDate).startOf('date'), undefined, '[]'))
        });
    }

    calendarControlButtons = () => {
        return (
            <div className={"ui container"}>
                <div className="ui borderless fluid three item menu"
                     style={{borderStyle: "none", boxShadow: "none"}}>
                    <div className="item">
                        <button className="ui left floated labeled icon button" onClick={() => this.setMonth("prev")}>
                            <i className="left chevron icon"/>
                            {moment().add(this.state.prevMonth, 'months').format('MMMM')}
                        </button>
                    </div>
                    <div className="item">
                        <h2>{moment().add(this.state.currMonth, 'months').format('MMMM')}</h2>
                    </div>
                    <div className="item">
                        <button className="ui right floated right labeled icon button"
                                onClick={() => this.setMonth("next")}>
                            {moment().add(this.state.nextMonth, 'months').format('MMMM')}
                            <i className="right chevron icon"/>
                        </button>
                    </div>
                </div>
            </div>)
    }

    weekControlButtons = () => {
        return (
            <div className={"ui container"}>
                <div className="ui borderless fluid three item menu"
                     style={{borderStyle: "none", boxShadow: "none"}}>
                    <div className="item">
                        <button className="ui left floated labeled icon button" onClick={() => this.setWeek("prev")}>
                            <i className="left chevron icon"/>
                            {moment().startOf('week').add(this.state.prevWeek, 'weeks').format('M/DD') + " - " + moment().endOf('week').add(this.state.prevWeek, 'weeks').format('M/DD')}
                        </button>
                    </div>
                    <div className="item">
                        <h2>{moment().startOf('week').add(this.state.currWeek, 'weeks').format('MMMM DD') + " : " + moment().endOf('week').add(this.state.currWeek, 'weeks').format('MMMM DD')}</h2>
                    </div>
                    <div className="item">
                        <button className="ui right floated right labeled icon button"
                                onClick={() => this.setWeek("next")}>
                            {moment().startOf('week').add(this.state.nextWeek, 'weeks').format('M/DD') + " - " + moment().endOf('week').add(this.state.nextWeek, 'weeks').format('M/DD')}
                            <i className="right chevron icon"/>
                        </button>
                    </div>
                </div>
            </div>)
    }


    //TODO: Implement Edit Process (mark complete)
    taskComponents = () => {
        if (this.state.tasks.length > 0) {
            return Object.entries(this.state.tasks).map((entries, i) => {
                const process = entries[0];
                const task = entries[1];
                return (<div className="ui checkbox" key={i}>
                    <input type="checkbox" name="fill" tabIndex="0"
                           onChange={this.handleChange}
                           defaultChecked={false}/>
                    <label>{process + ": " + task.phaseName}</label>
                </div>)
            })
        } else {
            return <div style={{paddingTop: "80px", paddingLeft: "20%"}}>¯\_(ツ)_/¯</div>
        }
    }

    tankFilterComponents = () => {
        return Object.entries(this.state.tanks).map((tank, i) => {
            return (
                <div className={"field"} key={i} style={{padding: "2%"}}>
                    <div className="ui checkbox">
                        <input type="checkbox" name="tankFilter" tabIndex="0"
                               onChange={(e) => {
                                   this.setTankFilter(e, tank[0])
                               }}
                               defaultChecked={false}/>
                        <label>{tank[1].name}</label>
                    </div>
                </div>)
        })
    }

    //Processes can be accessed by their tanks {tankId:[AssociatedProcesses]}
    //If tank filter is selected, add above array under tank id
    //Add to greater filtered list, no repeats: filteredList = each array from above tanks object
    //Remove by deleting tankId unselected from tanks object
    //Rerun filtered List creation from remaining list, or show unfiltered
    setTankFilter = (e, tankId) => {
        let {checked} = e.target;
        if (checked) {
            let filtered = {}
            filtered[tankId] = [];
            for (let el in this.state.processes) {
                for (let le of this.state.processes[el].phases) {
                    if (!filtered[tankId].includes(this.state.processes[el]) && (le.startTank === tankId || le.endTank === tankId)) {
                        filtered[tankId].push(this.state.processes[el]);
                    }
                }
            }
            let filteredProcesses = this.state.filteredProcesses;
            filteredProcesses = {...filteredProcesses, [tankId]: filtered[tankId]};
            if (Object.keys(filteredProcesses).length > 0) {
                let rendered = {}
                for (let el in filteredProcesses) {
                    filteredProcesses[el].forEach((process) => {
                        if (!rendered[process]) {
                            rendered = {...rendered, [process._id]: process}
                        }
                    })
                }
                this.setState(state => ({
                    filteredProcesses: {...state.filteredProcesses, ...filtered},
                    renderedProcesses: {...state.renderedProcesses, ...rendered}
                }))
            }
        } else {
            let newFiltered = this.state.filteredProcesses;
            let rendered = {};
            delete newFiltered[tankId];
            if (Object.keys(newFiltered).length > 0) {
                for (let el in newFiltered) {
                    newFiltered[el].forEach((process) => {
                        if (!rendered[process]) {
                            rendered = {...rendered, [process._id]: process}
                        }
                    })
                }
            }
            this.setState(state => ({
                filteredProcesses: newFiltered,
                renderedProcesses: rendered
            }))
        }
    }

    sidebar = () => {
        return (
            <div className="ui side attached vertical menu" style={{margin: "1em"}}>
                <div className={"item"}>
                    <div className={"ui buttons"}>
                        <div className={`ui ${this.state.monthViewActive ? "" : "active yellow"}  button`}
                             onClick={() => {
                                 this.setState({monthViewActive: false})
                             }} style={{minWidth: "80px", maxWidth: "80px"}}>
                            Week
                        </div>
                        <div className="or"/>
                        <div className={`ui ${this.state.monthViewActive ? "active yellow" : ""} button`}
                             onClick={() => {
                                 this.setState({monthViewActive: true})
                             }} style={{minWidth: "80px", maxWidth: "80px"}}>
                            Month
                        </div>
                    </div>
                </div>

                <div className={"item"}>
                    <div className={"ui buttons"}>
                        <div className={`ui ${this.state.processViewActive ? "active yellow" : ""} button`}
                             onClick={() => {
                                 this.setState({processViewActive: true})
                             }} style={{minWidth: "80px", maxWidth: "80px", paddingInline: "1px"}}>
                            Process
                        </div>
                        <div className="or"/>
                        <div className={`ui ${this.state.processViewActive ? "" : "active yellow"} button`}
                             onClick={() => {
                                 this.setState({processViewActive: false})
                             }} style={{minWidth: "80px", maxWidth: "80px"}}>
                            Tank
                        </div>
                    </div>
                </div>
                <div className={"item"}>
                    <div className={"ui basic segment"}>
                        <div className={"ui header"}>Today's Tasks</div>
                        <div className={"content"}
                             style={{maxHeight: "225px", overflow: "auto", minHeight: "200px"}}>
                            {this.taskComponents()}
                        </div>
                    </div>
                </div>
                <div className={"item"}>
                    <div className={"ui basic segment"}>
                        <div className={"ui header"}>Filter Tanks</div>
                        <div className={"content"} style={{maxHeight: "250px", overflow: "auto", minHeight: "200px"}}>
                            <div className={"grouped fields"}>
                                {this.tankFilterComponents()}
                            </div>
                        </div>
                        <div className={"ui mini basic blue button"} onClick={() => {
                            let ele = document.getElementsByName("tankFilter");
                            for (let i = 0; i < ele.length; i++)
                                ele[i].checked = false;
                            this.setState({renderedProcesses: {}, filteredProcesses: {}})
                        }} style={{padding: "2px"}}>Reset
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    calendarView = () => {
        const daysInPrevMonth = moment().add(this.state.prevMonth, 'months').endOf('month').get('day');
        const daysInCurrMonth = moment().add(this.state.currMonth, 'months').daysInMonth();
        let prevMonth = [];
        for (let i = daysInPrevMonth; i >= 0; i--) {
            let date = moment().add(this.state.prevMonth, 'months').endOf('month').subtract(i, 'days');
            let phases = this.getPhasesByDate(date)
            prevMonth.push(
                <Date date={date} events={phases} key={i + 100} processesActive={this.state.processViewActive}
                      getTankDetails={(id) => this.getTankDetails(id)}
                      calModalData={(processId, tankId, date) => this.calModalData(processId, tankId, date)}/>
            );
        }
        let daysInMonth = [];
        for (let i = 1; i <= daysInCurrMonth; i++) {
            let date = moment().add(this.state.currMonth, 'months').date(i);
            let phases = this.getPhasesByDate(date)
            daysInMonth.push(
                <Date date={date} events={phases} key={i + 200} processesActive={this.state.processViewActive}
                      getTankDetails={(id) => this.getTankDetails(id)}
                      calModalData={(processId, tankId, date) => this.calModalData(processId, tankId, date)}/>
            );
        }

        let totalSlots = [...prevMonth, ...daysInMonth];
        let nextMonth = [];
        let maxDates = totalSlots.length;
        let i = 0;
        while (maxDates % 7 !== 0) {
            let date = moment().add(this.state.nextMonth, 'months').startOf('month').add(i, 'days');
            let phases = this.getPhasesByDate(date)
            nextMonth.push(
                <Date date={date} events={phases} key={i + 300} processesActive={this.state.processViewActive}
                      getTankDetails={(id) => this.getTankDetails(id)}
                      calModalData={(processId, tankId, date) => this.calModalData(processId, tankId, date)}/>
            )
            i++;
            maxDates++;
        }
        totalSlots = [...totalSlots, nextMonth];
        let rows = [];
        let cells = [];
        totalSlots.forEach((day, i) => {
            if (i % 7 !== 0) {
                cells.push(day); // if index not equal 7 that means not go to next week
            } else {
                rows.push(cells); // when reach next week we contain all td in last week to rows
                cells = []; // empty container
                cells.push(day); // in current loop we still push current row to new container
            }
            if (i === totalSlots.length - 1) { // when end loop we add remain date
                rows.push(cells);
            }
        });

        let daysinmonth = rows.map((d, i) => {
            return <div key={i} className={"seven column row"} style={{minHeight: "133px"}}>{d}</div>
        });
        daysinmonth.shift();

        return (
            <div className={"ui side attached segment"} style={{padding: "0", borderStyle: "none"}}>
                {this.calendarControlButtons()}
                <div className={"ui stackable celled seven column grid fluid container"}
                     style={{margin: "0", width: "100%"}}>
                    <div className={"seven column row"}>{this.weekdayShortName()}</div>
                    {daysinmonth}
                </div>
            </div>
        )
    }

    weekView = () => {
        const weekStart = moment().startOf('week');

        let week = [];

        for (let i = 0; i <= 6; i++) {
            let date = moment(weekStart).add(this.state.currWeek, 'weeks').add(i, 'days')
            let phases = this.getPhasesByDate(date)
            week.push(<Date date={date} events={phases} key={i + 100} week={true}
                            processesActive={this.state.processViewActive}
                            getTankDetails={(id) => this.getTankDetails(id)}
                            calModalData={(processId, tankId) => this.calModalData(processId, tankId)}/>);
        }

        return (
            <div className={"ui side attached segment"} style={{padding: "0", borderStyle: "none"}}>
                {this.weekControlButtons()}
                <div className={"ui stackable celled seven column grid fluid container"}
                     style={{margin: "0", width: "100%"}}>
                    <div className={"seven column row"}>{this.weekdayShortName()}</div>
                    <div className={"seven column row"} style={{minHeight: "133px"}}>{week}</div>
                </div>
            </div>
        )
    }


    render() {
        console.log("render")

        return (<div>
            <NavComponent tanks={false}/>
            <div className="ui horizontal divider"/>
            <div className="container" style={{display: "flex", flexDirection: "row"}}>
                {this.sidebar()}
                <CalendarModal
                    showModal={this.state.showModal}
                    closeModal={() => {
                        this.closeModal()
                    }}
                    modalData={{
                        process: this.state.processes[this.state.modalProcessId],
                        tank: this.state.tanks[this.state.modalTankId],
                        date: this.state.modalDate,
                        beer: this.state.modalBeerData
                    }}
                />
                {this.state.monthViewActive ? this.calendarView() : this.weekView()}
            </div>
        </div>)
    }


}

export default Calendar;

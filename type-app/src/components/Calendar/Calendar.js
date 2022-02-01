import React from "react";
import NavComponent from "../NavComponent";
import moment from 'moment'
import Date from "./Date";
import typeApi from "../../api/type-server";

class Calendar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            weekdayshort: moment.weekdaysShort(),
            processes: {},
            colors: ['#FFF897', '#EDCF5C', '#f6c101', '#EC9D00', '#DF8D03', '#C96E12', '#9C5511', '#6F3B10', '#42220F', '#14080E'],
            prevMonth: -1,
            currMonth: 0,
            nextMonth: 1,
            monthViewActive: true,
            tasks: [],
            count: 0
        }

    }

    async componentDidMount() {
        await typeApi.get('/process').then(response => {
            const obj = response.data.reduce((a, v, i) => ({
                ...a,
                [v._id]: {...v, color: this.state.colors[(i % 10 + 10) % 10]}
            }), {})

            let tasks = {};
            let date = moment();
            for (let el in obj) {
                for (let le of obj[el].phases) {
                    let endDate = le.endDate.split("T", 1)[0];
                    if (date.startOf('day').isBetween(endDate, moment(endDate).endOf('day'), 'date', "[]")) {
                        tasks = {...tasks, [obj[el].name]: {...le, processId: obj[el]._id}}
                    }
                }
            }
            this.setState({tasks, isLoaded: true, processes: obj});
        }, err => {
            this.setState(state => ({
                isLoaded: true,
                error: [...state.error, err.message]
            }))
        });
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
        console.log(this.state)
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
        return Object.values(this.state.processes).filter(process => {
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


    taskComponents = () => {
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
    }

    sidebar = () => {
        return (
            <div className="ui side attached vertical menu" style={{margin: "1em"}}>
                <div className={"item"}>
                    <div className={"ui buttons"}>
                        <div className={`ui ${this.state.monthViewActive ? "" : "active yellow"}  button`}>
                            Week
                        </div>
                        <div className="or"/>
                        <div className={`ui ${this.state.monthViewActive ? "active yellow" : ""} button`}>
                            Month
                        </div>
                    </div>
                </div>

                <div className={"item"}>
                    <div className="ui horizontal divider"/>
                </div>
                <div className={"item"}>
                    <div className={`ui ${this.state.monthViewActive ? "active yellow" : ""} fluid button`}>
                        Processes
                    </div>
                </div>
                <div className={"item"}>
                    <div className={`ui ${this.state.monthViewActive ? "" : "active yellow"} fluid button`}>
                        Tanks
                    </div>
                </div>
                <div className={"item"}>
                    <div className="ui horizontal divider"/>
                    <div className={"ui segment"}>
                        <div className={"ui header"}>Today's Tasks</div>
                        <div className={"content"}>
                            {this.taskComponents()}
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
                <Date date={date} events={phases} key={i + 100}/>
            );
        }
        let daysInMonth = [];
        for (let i = 1; i <= daysInCurrMonth; i++) {
            let date = moment().add(this.state.currMonth, 'months').date(i);
            let phases = this.getPhasesByDate(date)
            daysInMonth.push(
                <Date date={date} events={phases} key={i + 200}/>
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
                <Date date={date} events={phases} key={i + 300}/>
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

    render() {
        console.log("render")
        return (<div>
            <NavComponent tanks={false}/>
            <div className="ui horizontal divider"/>
            <div className="container" style={{display: "flex", flexDirection: "row"}}>
                {this.sidebar()}
                {this.calendarView()}
            </div>
        </div>)
    }
}

export default Calendar;

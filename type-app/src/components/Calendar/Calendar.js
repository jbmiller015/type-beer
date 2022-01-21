import React from "react";
import NavComponent from "../NavComponent";
import moment from 'moment'
import Date from "./Date";
import typeApi from "../../api/type-server";

class Calendar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dateObject: moment(),
            weekdayshort: moment.weekdaysShort(),
            processes: {},
            colors: ['#FFF897', '#EDCF5C', '#f6c101', '#EC9D00', '#DF8D03', '#C96E12', '#9C5511', '#6F3B10', '#42220F', '#14080E'],
            maxDates: 42,
            prevMonth: -1,
            currMonth: 0,
            nextMonth: 1
        }

    }

    async componentDidMount() {
        await typeApi.get('/process').then(response => {
            response.data.map((el, i) => {
                el.color = this.state.colors[(i % 10 + 10) % 10];
                console.log(el)
                this.setState(prevState => ({
                    processes: {
                        ...prevState.processes,
                        [el._id]: el
                    }
                }))
            })
            this.setState({isLoaded: true})
        }, err => {
            this.setState(state => ({
                isLoaded: true,
                error: [...state.error, err.message]
            }))
        });
    }

    DayOfMonth = () => {
        let dateObject = this.state.dateObject;
        let firstDay = moment(dateObject)
            .startOf("month")
            .format("d");

        let lastDay = moment(dateObject)
            .endOf("month")
            .format("d");

        return {firstDay, lastDay};
    };


    weekdayShortName = () => {
        return this.state.weekdayshort.map(day => {
            return (
                <div className={"column"} key={day}>
                    <h4>{day}</h4>

                </div>
            );
        });
    }

    getPhasesByDate(date) {
        return Object.values(this.state.processes).filter(process => {
            return date.isSameOrAfter(process.startDate) && date.isSameOrBefore(process.endDate)
        });
    }

    calendarControlButtons() {
        return (
            <div className={"ui container"}>
                <div className="ui borderless fluid three item menu"
                     style={{borderStyle: "none", boxShadow: "none"}}>
                    <div className="item">
                        <button className="ui left floated labeled icon button">
                            <i className="left chevron icon"/>
                            {moment().add(this.state.prevMonth, 'months').format('MMMM')}
                        </button>
                    </div>
                    <div className="item">
                        <h2>{moment().add(this.state.currMonth, 'months').format('MMMM')}</h2>
                    </div>
                    <div className="item">
                        <button className="ui right floated right labeled icon button">
                            {moment().add(this.state.nextMonth, 'months').format('MMMM')}
                            <i className="right chevron icon"/>
                        </button>
                    </div>
                </div>
            </div>)
    }

    render() {
        let prevMonth = [];
        for (let i = this.DayOfMonth().firstDay - 1; i > -1; i--) {
            let date = moment().add(this.state.prevMonth, 'months').endOf('month').subtract(i, 'days');
            prevMonth.push(
                <Date date={date} events={this.getPhasesByDate(date)}/>
            );
        }
        let daysInMonth = [];
        for (let i = 1; i <= this.state.dateObject.daysInMonth(); i++) {
            let date = moment().add(this.state.currMonth, 'months').date(i);
            daysInMonth.push(
                <Date date={date} events={this.getPhasesByDate(date)}/>
            );
        }

        let totalSlots = [...prevMonth, ...daysInMonth];
        let nextMonth = [];
        for (let i = 0; i < (this.state.maxDates - totalSlots.length); i++) {
            let date = moment().add(this.state.nextMonth, 'months').startOf('month').add(i, 'days');
            nextMonth.push(
                <Date date={date} events={this.getPhasesByDate(date)}/>
            )
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
            return <div className={"seven column row"} style={{minHeight: "133px"}}>{d}</div>
        });
        daysinmonth.shift();
        return (<div>
            <NavComponent tanks={false}/>
            <div className="ui horizontal divider"/>
            {this.calendarControlButtons()}
            <div style={{paddingInline: "2%"}}>
                <div className={"ui stackable celled seven column grid container"}>
                    <div className={"seven column row"}>{this.weekdayShortName()}</div>
                    {daysinmonth}
                </div>
            </div>
        </div>)
    }


}

export default Calendar;

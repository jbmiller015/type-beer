import React from "react";
import NavComponent from "../NavComponent";
import moment from 'moment'

class Calendar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dateObject: moment(),
            weekdayshort: moment.weekdaysShort()
        }
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
                    <div className={"ui basic segment"}>
                        <p>{day}</p>
                    </div>
                </div>
            );
        });
    }

    render() {
        let blanks = [];
        for (let i = 0; i < this.DayOfMonth().firstDay; i++) {
            blanks.push(
                <div className={"column"}>
                    <div className={"ui basic segment"}>
                        <p>{""}</p>
                    </div>
                </div>
            );
        }
        let daysInMonth = [];
        for (let d = 1; d <= this.state.dateObject.daysInMonth(); d++) {
            daysInMonth.push(
                <div className={"column"}>
                    <div className={"ui basic segment"}>
                        <p>{d}</p>
                    </div>
                </div>
            );
        }

        let totalSlots = [...blanks, ...daysInMonth];
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

        console.log("Rows: ", rows)
        console.log("Cells: ", cells)

        let daysinmonth = rows.map((d, i) => {
            return <div className={"seven column row"}>{d}</div>
        });
        return (<div>
            <NavComponent tanks={false}/>
            <div className="ui horizontal divider"/>
            <div style={{paddingInline: "2%"}}>
                <div className={"ui stackable celled seven column grid"}>
                    <div className={"seven column row"}>{this.weekdayShortName()}</div>
                    {daysinmonth}
                </div>
            </div>
        </div>)
    }
}

export default Calendar;

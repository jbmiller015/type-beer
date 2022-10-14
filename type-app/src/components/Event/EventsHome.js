import React from "react";
import typeApi from "../../api/type-server";
import moment from "moment";
import {formatDate} from "../Process/ProcessFunctions";
import EventYear from "./EventYear";

class EventsHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            events: {},
            eventTasks: {}
        }
    }

    async componentDidMount() {
        const eventResults = await typeApi.get('/event').then(response => {
            const eventObj = response.data

            let eventTasks = {};
            for (let i = 0; i < eventObj.length; i++) {
                let endDate = eventObj[i].endDate;
                if (moment().startOf('date').isBetween(moment(endDate).startOf('date'), moment(endDate).endOf('date'), 'date', "[]")) {
                    eventTasks = {
                        ...eventTasks,
                        [eventObj[i].name]:
                            {
                                ...eventObj[i],
                                index: i
                            }
                    }
                }
            }
            let eventsByDate = {};
            for (let event of eventObj) {
                const eventMoment = moment(event.startDate);
                const year = eventMoment.get("year");
                const month = eventMoment.get("month");
                if(!eventsByDate[year]){
                    eventsByDate[year]={}
                }
                if(!eventsByDate[year][month]){
                    eventsByDate[year][month] = []
                    eventsByDate[year][month].push(event)
                }
                else if(eventsByDate[year][month]){
                    eventsByDate[year][month].push(event)
                }
            }
            return {eventTasks, eventObj, eventsByDate};
        }, err => {
            this.setState(state => ({
                isLoaded: true,
                error: [...state.error, err.message]
            }))
        })
        this.setState({
            eventTasks: eventResults.eventTasks,
            events: eventResults.eventObj,
            eventsByDate: eventResults.eventsByDate,
            isLoaded: true
        });
    }

    years(){
        return(<EventYear data={}/>)
    }

    render() {
        return (<div className={'ui segments'}>EventsHome</div>)
    };
}

export default EventsHome;

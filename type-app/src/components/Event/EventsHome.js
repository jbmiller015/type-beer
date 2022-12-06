import React from "react";
import typeApi from "../../api/type-server";
import moment from "moment";
import EventYear from "./EventYear";
import NavComponent from "../NavComponent";
import {formatDate} from "../Process/ProcessFunctions";
import GoToCreate from "../Buttons/GoToCreate";

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
                let eventMoment = moment(event.startDate);
                const year = eventMoment.get("year");
                const month = eventMoment.get("month");
                if (!eventsByDate[year]) {
                    eventsByDate[year] = {}
                }
                if (!eventsByDate[year][month]) {
                    eventsByDate[year][month] = []
                    eventsByDate[year][month].push(event)
                } else if (eventsByDate[year][month]) {
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

    deleteEvent = (eventId) => {
        typeApi.delete(`/event/${eventId}`).then((res) => {
            window.location.reload();
            this.setState({infoMessage: "Deleted Event:" + eventId})
        }).catch(err => {
            this.setState(state => ({
                error: [...state.error, err.message]
            }))
        })
    }

    handleEventChange = async (data) => {

        return await this.putEvent(data._id, data).then(data => {
            return data
        });
    }


    putEvent = async (eventId, event) => {
        const data = await typeApi.put(`/event/${eventId}`, event).then((res) => {
            return res.data
        }).catch(err => {
            this.setState(state => ({
                error: [...state.error, err.message]
            }))
        })
        let newState = {...this.state};
        newState = newState.events.map(e=> {
            return e._id === eventId ? event : e;
        } )
        this.setState(newState);
        return data;
    }

    years() {
            return Object.entries(this.state.eventsByDate).map((event, i) => {
                const active = event[0] === new Date().getFullYear().toString();
                return <EventYear data={event} activeYear={active} key={"eventYear" + i}
                                  deleteEvent={(eventId) => {
                                      this.deleteEvent(eventId)
                                  }}
                                  handleEventChange={async (e, eventId) => {
                                      return this.handleEventChange(e, eventId).then(data => {
                                          return data
                                      })
                                  }}/>
            })
    }

    render() {
        return (<div>
                <NavComponent tanks={false}/>
                <div style={{display: "flex", alignContent: "center", justifyContent: "center", paddingTop: "5%"}}>
                    {this.state.events && this.state.eventsByDate ?  <div className={'ui styled accordion'}>{this.years()}</div>: this.state.isLoaded ? <GoToCreate destination={"event"}/> : null}
                </div>
            </div>
        )
    };
}

export default EventsHome;

import React, {useState} from 'react';
import moment from "moment";

const EventSegment = (props) => {
    const [eventData, setEventData] = useState(props.data);
    const [showDetail, setShowDetail] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [edit, setEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const {deleteEvent} = props;

    const formatDates = (startDate, endDate) => {
        const start = moment(startDate.split("T", 1)[0]);
        const end = moment(endDate.split("T", 1)[0]);
        const startDateFormatted = start.format("dddd, Do");
        const endDateFormatted = !start.isSame(end, 'month') ? end.format("dddd, MMMM Do") : end.format("dddd, Do");

        return {startDateFormatted, endDateFormatted}
    }

    const {startDateFormatted, endDateFormatted} = formatDates(eventData.startDate, eventData.endDate);


    console.log(eventData)
    return (
        <div className={"ui basic segment"} style={{paddingTop: "0"}}>
            <div className={"ui basic fluid card"}>
                <div className={"content"} style={{paddingTop: "14px", paddingBottom: "14px"}}>
                    <div className={"meta"} onClick={() => {
                        setShowDetail(!showDetail)
                    }}>
                        <a className={"ui medium header"}>{
                            !eventData.eventType ? eventData.name : eventData.name + " |"
                        }</a>
                        <span className={"ui tiny yellow header"}
                              style={{paddingLeft: "1px"}}>{eventData.eventType}</span>
                    </div>
                    <div className={"ui small header"} onClick={() => {
                        setShowDetail(!showDetail)
                    }}
                         style={{marginTop: "0"}}>{(startDateFormatted === endDateFormatted) ? startDateFormatted : startDateFormatted + " - " + endDateFormatted}</div>
                    {showDetail ? <div className="description">
                        <p>{eventData.details}</p>
                    </div> : null}
                </div>
                {
                    showDetail ? <div className="extra content"
                                      style={{
                                          paddingTop: "2%",
                                          paddingBottom: "2%",
                                          display: "flex",
                                          justifyContent: "right",
                                          flexDirection: "row"
                                      }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "right",
                            flexDirection: "row"
                        }}>
                            {!showDelete && !edit ? <button className="circular tiny ui icon button" onClick={() => {
                                setShowEdit(!showEdit)
                            }}>
                                <i className="icon settings"/>
                            </button> : null}
                            {showEdit ? <div>
                                <div className="ui tiny basic grey button" onClick={() => {
                                    setShowEdit(!showEdit)
                                    setEdit(!edit)
                                }}>Edit
                                </div>
                                <div className="ui tiny basic red button" onClick={() => {
                                    setShowDelete(!showDelete)
                                    setShowEdit(!showEdit)
                                }}>Delete
                                </div>
                            </div> : null}
                            {showDelete ? <div>
                                <div className="ui tiny basic red button" onClick={() => {
                                    setShowDelete(!showDelete);
                                    props.deleteEvent(eventData._id);
                                }}>Delete
                                </div>
                                <div className="ui tiny basic grey button" onClick={() => {
                                    setShowDelete(!showDelete)
                                }}>Cancel
                                </div>
                            </div> : null}
                            {edit ? <div>
                                <div className="ui tiny basic grey button" onClick={() => {
                                    setEdit(!edit)
                                }}>Cancel
                                </div>
                                <div className="ui tiny basic green button" onClick={(e) => {
                                    setEdit(!edit)
                                    props.handleEventChange(e, eventData._id)
                                }}>Save
                                </div>
                            </div> : null}
                        </div>
                    </div> : null
                }
            </div>
        </div>);
}
export default EventSegment;

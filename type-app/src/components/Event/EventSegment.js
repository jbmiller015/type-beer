import React, {useState} from 'react';
import moment from "moment";

const EventSegment = (props) => {
    const [eventData, setEventData] = useState(props.data);
    const [showDetail, setShowDetail] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const formatDate = (date) => {
        return moment(date.split("T", 1)[0]).format("dddd, Do")
    }


    console.log(eventData)
    return (
        <div className={"ui basic segment"} style={{paddingTop: "0"}}>
            <div className={"ui basic fluid card"}>
                <div className={"content"} style={{paddingTop: "14px", paddingBottom: "14px"}}>
                    <a className={"header"} onClick={() => {
                        setShowDetail(!showDetail)
                    }}>{formatDate(eventData.startDate)}</a>
                    <div className={"meta"} onClick={() => {
                        setShowDetail(!showDetail)
                    }}>
                        <span className={"ui medium header"}>{
                            !eventData.eventType ? eventData.name : eventData.name + " |"
                        }</span>
                        <span className={"ui tiny yellow header"}
                              style={{paddingLeft: "1px"}}>{eventData.eventType}</span>
                    </div>
                    {showDetail ? <div className="description">
                        <p>{eventData.details}</p>
                    </div> : null}
                </div>
                {
                    showDetail ? <div class="extra content"
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
                            <button className="circular tiny ui icon button" onClick={() => {
                                setShowEdit(!showEdit)
                            }}>
                                <i className="icon settings"/>
                            </button>
                            {showEdit ? <div>
                                <div className="ui tiny basic grey button">Edit</div>
                                <div className="ui tiny basic red button">Delete</div>
                            </div> : null}
                        </div>
                    </div> : null
                }
            </div>
        </div>);
}
export default EventSegment;

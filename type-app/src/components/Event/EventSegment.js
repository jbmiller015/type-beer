import React, {useState} from 'react';
import moment from "moment";
import EditOrDelete from "../Buttons/EditOrDelete";

const EventSegment = (props) => {
    const {deleteEvent} = props
    const [eventData, setEventData] = useState(props.data);
    const [showDetail, setShowDetail] = useState(false);
    const [editFields, setEditFields] = useState(false);

    const formatDates = (startDate, endDate) => {
        const start = moment(startDate.split("T", 1)[0]);
        const end = moment(endDate.split("T", 1)[0]);
        const startDateFormatted = start.format("dddd, Do");
        const endDateFormatted = !start.isSame(end, 'month') ? end.format("dddd, MMMM Do") : end.format("dddd, Do");

        return {startDateFormatted, endDateFormatted}
    }

    const formatFieldDates = (startDate, endDate) => {
        const start = moment(startDate.split("T", 1)[0]);
        const end = moment(endDate.split("T", 1)[0]);
        const startDateFieldFormatted = start.format("yyyy-MM-DD");
        const endDateFieldFormatted = end.format("yyyy-MM-DD");
        return {startDateFieldFormatted, endDateFieldFormatted}
    }
    const getColumns = () => {
        const mod = window.innerWidth > 415 ? 12 : 10.5;
        return Math.ceil(document.getElementById('textAreaParent').clientWidth / 100) * mod;
    }

    const handleEventChange = () => {
        //handleEventChange = async (e, eventId) => {
        //         let {name, value} = e.target;
        props.handleEventChange(eventData)
    }
    const {startDateFormatted, endDateFormatted} = formatDates(eventData.startDate, eventData.endDate);
    const {startDateFieldFormatted, endDateFieldFormatted} = formatFieldDates(eventData.startDate, eventData.endDate);

    return (
        <div className={"ui basic segment"} style={{paddingTop: "0"}}>
            <div className={"ui basic fluid card"}>
                <div className={"content"} style={{paddingTop: "14px", paddingBottom: "14px"}}>
                    <div className={"meta"} style={{cursor: "pointer"}} onClick={() => {
                        setShowDetail(!showDetail)
                    }}>
                        <a className={"ui medium header"}>{
                            eventData.eventType ? eventData.name + " |" : eventData.name
                        }</a>
                        <span className={"ui tiny yellow header"}
                              style={{paddingLeft: "1px"}}>{eventData.eventType}</span>
                    </div>
                    {editFields ?
                        <div>
                            <label>Start Date</label>
                            <div className="ui input">
                                <input type="Date" name={"startDate"} defaultValue={startDateFieldFormatted}
                                       onChange={(e) => {
                                           setEventData( {...eventData, startDate: e.target.value})
                                       }}/>
                            </div>
                            <label>End Date</label>
                            <div className="ui input">
                                <input type="Date" name={"endDate"} defaultValue={endDateFieldFormatted}
                                       onChange={(e) => {
                                           setEventData({...eventData, endDate: e.target.value})
                                       }}/>
                            </div>
                        </div> :
                        <div className={"ui small header"} onClick={() => {
                            setShowDetail(!showDetail)
                        }}
                             style={{
                                 marginTop: "0",
                                 cursor: "pointer"
                             }}>{(startDateFormatted === endDateFormatted) ? startDateFormatted : startDateFormatted + " - " + endDateFormatted}</div>
                    }
                    {showDetail ? <div className="extra content"
                                       style={{
                                           paddingTop: "2%",
                                           paddingBottom: "2%"
                                       }}>
                        <div className="description" id={"textAreaParent"}>
                            {editFields ? <textarea name={"details"} cols={getColumns()} rows="10"
                                                    value={eventData.details}
                                                    onChange={(e) => setEventData({...eventData, details: e.target.value})}/> :
                                <p>{eventData.details}</p>}
                        </div>
                        <EditOrDelete eventData={eventData} deleteEvent={deleteEvent}
                                      handleEventChange={handleEventChange} setEditFields={setEditFields}/>
                    </div> : null}
                </div>
            </div>
        </div>
    );
}
export default EventSegment;

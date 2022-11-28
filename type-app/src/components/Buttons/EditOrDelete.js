import React, {useState} from 'react';

const EditOrDelete = (props) => {
    const {eventData, deleteEvent, handleEventChange, setEditFields} = props;
    const [showEdit, setShowEdit] = useState(false);
    const [edit, setEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    return (<div style={{
        display: "flex",
        justifyContent: "right",
        flexDirection: "row"
    }}>

        {showEdit ? <div>
            <div className="ui tiny basic red button" onClick={() => {
                setShowDelete(!showDelete)
                setShowEdit(!showEdit)
            }}>Delete
            </div>
            <div className="ui tiny basic grey button" onClick={() => {
                setShowEdit(!showEdit)
                setEdit(!edit)
                setEditFields(true);
            }}>Edit
            </div>
        </div> : null}
        {showDelete ? <div>
            <div className="ui tiny basic grey button" onClick={() => {
                setShowDelete(!showDelete)
            }}>Cancel
            </div>
            <div className="ui tiny basic red button" onClick={() => {
                setShowDelete(!showDelete);
                deleteEvent(eventData._id);
            }}>Delete
            </div>
            <button className="circular basic tiny ui icon button" onClick={() => {
                setEdit(false)
                setShowEdit(false)
                setShowDelete(false)
            }}>
                <i className="icon yellow settings"/>
            </button>
        </div> : null}
        {edit ? <div>
            <div className="ui tiny basic grey button" onClick={() => {
                setEdit(!edit)
                setEditFields(false);
            }}>Cancel
            </div>
            <div className="ui tiny basic green button" onClick={(e) => {
                setEdit(!edit)
                handleEventChange(e, eventData._id)
                setEditFields(false);
            }}>Save
            </div>
            <button className="circular basic tiny ui icon button" onClick={() => {
                setEdit(false)
                setShowEdit(false)
                setShowDelete(false)
            }}>
                <i className="icon yellow settings"/>
            </button>
        </div> : null}
        {!showDelete && !edit ? <button className="circular basic tiny ui icon button" onClick={() => {
            setShowEdit(!showEdit)
        }}>
            <i className="icon yellow settings"/>
        </button> : null}
    </div>);
}
export default EditOrDelete;

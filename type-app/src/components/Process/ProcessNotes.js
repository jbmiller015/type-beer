import React, {useState} from 'react';
import useComponentVisible from "../Hooks/useComponentVisible";


const ProcessNotes = ({ data, handleProcessChange, name, type, editable}) => {
    const {ref, isComponentVisible, setIsComponentVisible} = useComponentVisible(false);
    const [notes, setNotes] = useState(data);
    //TODO:handle when click off -> ref off => notes -> handleProcessChange.
    //TODO:Make text more readable.
    //TODO: Handle new line and tabs.
    return (
        <div className={"ui fluid segment"} ref={ref} onClick={() => {
            setIsComponentVisible(true)
        }}>
            <div className="content">
                {isComponentVisible && editable?
                    <div className="ui fluid input">
                        <input type={type} name={name} value={notes} onChange={(e) => setNotes(e.target.value)}/>
                    </div> : notes}
            </div>
        </div>);
}
export default ProcessNotes;

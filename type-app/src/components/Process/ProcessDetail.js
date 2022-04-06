import React, {useState} from 'react';
import useComponentVisible from "../Hooks/useComponentVisible";


//TODO:handle state change starting here
const ProcessDetail = ({icon, header, data, type, editable, handleProcessChange, name}) => {
    const [showEdit, setShowEdit] = useState(false)
    const {ref, isComponentVisible, setIsComponentVisible} = useComponentVisible(false);


    return (
        <div className={"ui centered card"}>
            <div className="content">
                <div className={"ui center aligned small header"}>
                    <i className={`ui ${icon} icon`}/>
                    {header}:
                </div>
            </div>
            <div className="content" ref={ref} onClick={() => {
                setIsComponentVisible(true)
            }}>
                <div className={"ui center aligned description"}>
                    {isComponentVisible && editable ?
                        <div className="ui fluid input">
                            <input type={type} name={name} placeholder={data} onChange={(e) => handleProcessChange(e)}/>
                        </div> : data}
                </div>
            </div>
        </div>);
}
export default ProcessDetail;

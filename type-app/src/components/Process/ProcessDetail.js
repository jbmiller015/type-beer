import React, {useState} from 'react';
import useComponentVisible from "../Hooks/useComponentVisible";

const ProcessDetail = ({icon, header, data}) => {
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
                    {isComponentVisible ? <div className="ui fluid icon input">
                        <input type="text" placeholder="Search..."/>
                        <i id="icon" className="check green icon"/>
                    </div> : data}
                </div>
            </div>
        </div>);
}
export default ProcessDetail;

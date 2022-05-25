import React, {useEffect, useState} from 'react';
import useComponentVisible from "../Hooks/useComponentVisible";


const ProcessDetail = ({icon, header, data, type, editable, handleProcessChange, name}) => {
    const {ref, isComponentVisible, setIsComponentVisible} = useComponentVisible(false);


    const [term, setTerm] = useState(data);
    const [debouncedTerm, setDebouncedTerm] = useState(null);

    useEffect(() => {
        const procChange = () => {
            handleProcessChange({target: {name: name, value: debouncedTerm}});
        };
        if (debouncedTerm != null) {
            procChange();
        }

    }, [debouncedTerm]);

    useEffect(() => {
        let timerId;
        if (term !== data) {
            timerId = setTimeout(() => {
                setDebouncedTerm(term);
            }, 1000);
        }
        return (() => {
            clearTimeout(timerId)
        })
    }, [term])


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
                            <input type={type} name={name} placeholder={data}
                                   onChange={(e) => setTerm(e.target.value)}/>
                        </div> : data || null}
                </div>
            </div>
        </div>);
}
export default ProcessDetail;

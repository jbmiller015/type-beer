import React, {useEffect, useState} from 'react';
import useComponentVisible from "../Hooks/useComponentVisible";


const ProcessNotes = ({data, handleProcessChange, name, editable, label}) => {
    const {ref, isComponentVisible, setIsComponentVisible, handleClickOutside} = useComponentVisible(false);
    const [notes, setNotes] = useState(data);
    const [debouncedNotes, setDebouncedNotes] = useState(null);

    useEffect(() => {
        if (data)
            setNotes(data)
    }, [data])

    useEffect(() => {
        const procChange = () => {
            handleProcessChange({target: {name: name, value: debouncedNotes}});
        };
        if (debouncedNotes != null) {
            procChange();
        }

    }, [debouncedNotes]);

    useEffect(() => {
        let timerId;
        if (notes !== data) {
            timerId = setTimeout(() => {
                setDebouncedNotes(notes);
            }, 1000);
        }
        return (() => {
            clearTimeout(timerId)
        })
    }, [notes])

    const getColumns = () => {
        const mod = window.innerWidth > 415 ? 12 : 10.5;
        return Math.ceil(document.getElementById('textAreaParent').clientWidth / 100) * mod;
    }

    const handleClick = (e) => {
        e.preventDefault()
        handleProcessChange({target: {name: "notes", value: notes}});
        setIsComponentVisible(false);
    }

    return (
        <div className={"ui fluid segment"} ref={ref} onClick={() => {
            setIsComponentVisible(true)
        }} id={"textAreaParent"}>
            <div className="content" style={{whiteSpace: "pre-wrap"}}>
                {(editable && isComponentVisible) ?
                    {label? <label>{label}:</label>:null}
                    <textarea name={name} cols={getColumns()} rows="10"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}/>
                    : notes}
            </div>
        </div>);
}
export default ProcessNotes;

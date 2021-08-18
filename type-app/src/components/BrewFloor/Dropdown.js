import React, {useEffect, useState, useRef} from "react";

const Dropdown = ({options, selected, onSelectedChange, label}) => {

    const [open, setOpen] = useState(false);


    const ref = useRef();

    //enables closing dropdown by clicking body
    useEffect(() => {
        const onBodyClick = (event) => {
            if (ref.current.contains(event.target)) {
                return;
            }
            setOpen(false);
        };

        document.body.addEventListener("click", onBodyClick, {capture: true});

        //cleanup function
        return () => {
            document.body.removeEventListener("click", onBodyClick, {capture: true,});
        };
    }, []);

    const renderedOptions = options.map((option) => {

        if (option.value === selected.value) {
            return null;
        }

        return (
            <div
                key={option.value}
                className="item"
                onClick={() => {
                    onSelectedChange(option)
                }}>
                {option.label}
            </div>
        );
    });
    return (
        <div className="ui form" ref={ref}>
            <div className="field">
                <label className="label">{label}</label>
                <div
                    className={`ui selection dropdown ${open ? 'visible active' : ''}`}
                    onClick={() => {
                        setOpen(!open)
                    }}>
                    <i className="dropdown icon"></i>
                    <div className="text">{selected.label}</div>
                    <div className={`menu ${open ? 'visible transition' : ''}`}>{renderedOptions}</div>
                </div>
            </div>
        </div>
    );
};

export default Dropdown;

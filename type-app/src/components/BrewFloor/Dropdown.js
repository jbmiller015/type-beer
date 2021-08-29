import React, {useEffect, useState, useRef} from "react";
import typeApi from '../../api/type-server'

const Dropdown = ({selected, onSelectedChange, label}) => {

    const [open, setOpen] = useState(false);
    const [term, setTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState(term);
    const [results, setResults] = useState([]);


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

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedTerm(term);
        }, 1000);

        return (() => {
            clearTimeout(timerId)
        })
    }, [term])

    useEffect(() => {
        const search = async () => {
            const {data} = await typeApi.get('/beer', {
                params: {
                    name: debouncedTerm
                }
            });
            setResults(data);
        };
        if (debouncedTerm) {
            search();
        }

    }, [debouncedTerm]);

    const renderedOptions = results.map((option, i) => {

        if (option.name === selected.name) {
            return null;
        }

        return (
            <div
                key={i}
                className="item"
                onClick={() => {
                    onSelectedChange(option)
                }}>
                {option.name}
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
                    <i className="dropdown icon"/>
                    <label>Enter Search Term</label>
                    <input value={selected.name ? selected.name : term} onChange={e => setTerm(e.target.value)}
                           className="input"/>
                    <div className={`menu ${open ? 'visible transition' : ''}`}>{renderedOptions}</div>
                </div>
            </div>
        </div>
    );
};

export default Dropdown;

//<input className="text" type="text" placeholder={selected.name} value={selected.name}/>

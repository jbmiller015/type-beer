import React, {useEffect, useState, useRef} from "react";
import typeApi from '../../api/type-server'

const Dropdown = ({onSelectedChange, label, url}) => {

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
        }, 100);

        return (() => {
            clearTimeout(timerId)
        })
    }, [term])

    useEffect(() => {
        const search = async () => {
            const {data} = await typeApi.get(`/${url}`, {
                params: {
                    name: debouncedTerm
                }
            });
            setResults(data);
        };
        if (debouncedTerm) {
            search();
        }

    }, [debouncedTerm, url]);

    const renderedOptions = results.map((option, i) => {

        return (
            <div
                key={i}
                className="item"
                onClick={() => {
                    setTerm(option.name)
                    onSelectedChange(option)
                }}>
                {option.name}
            </div>
        );
    });
    return (
        <div className="field" ref={ref}>
            <label className="label">{label}</label>
            <div
                className={`ui selection dropdown ${open ? 'visible active' : ''}`}
                onClick={() => {
                    setOpen(!open)
                }}>
                <i className="dropdown icon"/>
                <label>Enter Search Term</label>
                <input value={term} onChange={e => setTerm(e.target.value)}
                       className="input"/>
                <div className={`menu ${open ? 'visible transition' : ''}`}>{renderedOptions}</div>
            </div>
        </div>

    );
};

export default Dropdown;

//<input className="text" type="text" placeholder={selected.name} value={selected.name}/>

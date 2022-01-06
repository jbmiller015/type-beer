import React, {useEffect, useState, useRef} from "react";
import typeApi from '../../api/type-server'

const Dropdown = ({onSelectedChange, label, url, target, defaultTerm}) => {

    console.log(defaultTerm)
    const [open, setOpen] = useState(false);
    const [term, setTerm] = useState(defaultTerm);
    const [debouncedTerm, setDebouncedTerm] = useState(defaultTerm);
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
            const filteredData = filterResults(data);
            setResults(filteredData);
        };
        if (debouncedTerm) {
            search();
        }

    }, [debouncedTerm, url]);

    const filterResults = (data) => {
        if (target === 'startTank') {

        }
        if (target === 'endTank') {

        }
        return data;
    }

    const renderedOptions = results.map((option, i) => {
        return (
            <div
                key={i}
                className="item"
                onClick={(e) => {
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

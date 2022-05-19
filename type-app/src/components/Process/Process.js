import React, {useCallback, useEffect, useState} from 'react';
import Phase from "./Phase";
import ProcessDetail from "./ProcessDetail";
import {formatDate} from "./ProcessFunctions"
import useComponentVisible from "../Hooks/useComponentVisible";

const Process = (props) => {
    const {
        processData,
        getTankDetails,
        handleProcessChange,
        deleteProcess,
        getBeerById,
    } = props;

    const [active, setActive] = useState(false);
    const [beerData, setBeerData] = useState({});
    const [choice, setChoice] = useState(null);
    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState(processData);
    const [newData, setNewData] = useState({});
    const {ref} = useComponentVisible(true);


    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            setActive(false)
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);

    useEffect(() => {
        console.log("in")
        return () => {
            console.log("out")
            setData(null)
            setActive(false)
        }
    }, [])

    useEffect(() => {
    }, [data])

    useEffect(async () => {
        if (choice !== null) {
            const data = await handleProcessChange(newData.e, newData.processId, newData.phaseIndex, choice);
            setData(data)
            setChoice(null)
        }
    }, [choice])

    const handleProcessDateChange = (e, processId, phaseIndex, show) => {
        if (show) {
            setNewData({e, processId, phaseIndex})
            setShowModal(true)
        }
    }

    const handleProcessYieldChange = async (e, _id) => {
        await handleProcessChange(e, _id).then(data => {
            setData(data)
        })
    }


    const handlePhaseChange = async (e, processId, phaseIndex, show) => {
        if (show) {
            setShowModal(true)
        }
        if (!show) {
            const data = await handleProcessChange(e, processId, phaseIndex)
            setData(data)
        } else {
            if (choice !== null) {
                const data = await handleProcessChange(e, processId, phaseIndex, choice)
                setData(data)
            }
        }
    }

    const chooseEditTypeModal = () => {
        return (
            <div className={`ui ${showModal ? 'active' : ''} modal`} style={{
                zIndex: 1000,
                position: "fixed",
                left: "0",
                right: "0",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "auto",
                marginBottom: "auto",
                width: "20%"
            }}>
                <div className="ui center aligned basic segment">
                    <div className="ui yellow button" onClick={() => {
                        setChoice("simple")
                        setShowModal(false)
                    }}>
                        Only Edit This Date
                    </div>
                    <div className="ui horizontal divider">
                        Or
                    </div>
                    <div className="ui yellow button" onClick={() => {
                        setChoice("complex")
                        setShowModal(false)
                    }}>
                        Edit This and All Subsequent Dates
                    </div>
                </div>
            </div>)
    }

    const renderPhases = () => {
        return data.phases.map((phase, i) => {
            let startTank = getTankDetails(phase.startTank);
            let endTank = phase.startTank === phase.endTank ? null : getTankDetails(phase.endTank);
            return <Phase phaseData={phase} style={{maxWidth: "100px", maxHeight: "100px"}} key={i} index={i}
                          tanks={{startTank, endTank}} handlePhaseChange={async (e, phaseIndex) => {
                if (e.target.name === "complete") {
                    let count = 0;
                    for (let el of data.phases) {
                        count += el.complete ? 1 : 0;
                    }
                    if (count === data.phases.length - 1 && e.target.checked) {
                        setActive(false)
                    }
                    await handlePhaseChange(e, data._id, phaseIndex)
                } else {
                    await handleProcessDateChange(e, data._id, phaseIndex, true)
                }
            }}/>
        })
    }


    return (
        !active ?
            <a className={"item"} onClick={async () => {
                const beer = await getBeerById(data.contents);
                setBeerData(beer);
                setActive(!active);
            }}>
                <div className="content">
                    <div className="header">
                        {data.name}
                    </div>
                </div>
            </a> :
            <div className={"item"} ref={ref}>
                {chooseEditTypeModal()}
                <div className="content">
                    <div className="ui medium header" style={{color: "goldenrod"}}>{data.name}</div>
                    <a style={{color: "grey"}}><i className={"ui right floated close large icon"} onClick={() => {
                        setActive(!active);
                    }}/></a>
                    <div className={"ui divider"}/>
                    <div className="ui small header">Details:</div>
                    <div className={"description"}>
                        <div className={"ui horizontal divider"}/>
                        <div className={"ui three stackable cards"}>
                            <ProcessDetail data={beerData.name} name={'contents'} icon={"beer"} header={"Contents"}
                                           editable={false}/>
                            <ProcessDetail data={formatDate(data.startDate)} name={'startDate'}
                                           icon={"calendar alternate outline"}
                                           header={"Process Start Date"} type={"date"} editable={true}
                                           handleProcessChange={(e) => handleProcessDateChange(e, data._id, null, true)}/>
                            <ProcessDetail data={formatDate(data.endDate)} name={'endDate'} icon={"calendar alternate"}
                                           header={"Process End Date"} type={"date"} editable={true}
                                           handleProcessChange={(e) => handleProcessDateChange(e, data._id, null, true)}/>
                            <ProcessDetail data={data.expectedYield} name={'expectedYield'} icon={"paper plane outline"}
                                           header={"Expected Yield"} type={"text"} editable={false}/>
                            <ProcessDetail data={data.actualYield} name={'actualYield'} icon={"paper plane"}
                                           header={"Actual Yield"} type={"text"} editable={true}
                                           handleProcessChange={(e) => handleProcessYieldChange(e, data._id)}/>
                        </div>
                        <div className={"ui divider"}/>
                        <div className="ui small header">Phases:</div>
                        <div className={"extra"}>
                            <div className={"ui three stackable cards"}>
                                {renderPhases()}
                            </div>
                        </div>
                    </div>
                    <div className="ui basic right floated icon button" onClick={() => {
                        deleteProcess(data._id)
                    }}><i className={"ui red trash icon"}/></div>

                </div>
            </div>
    );
}

export default Process;

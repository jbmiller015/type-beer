import React, {useEffect, useState} from 'react';
import moment from "moment";
import PhaseField from "./PhaseField";
import Phase from "./Phase";
import ProcessDetail from "./ProcessDetail";
import {formatDate} from "./ProcessFunctions"

const Process = (props) => {
    const {processData, getTankDetails, handleProcessChange, deleteProcess, getBeerById, closeOnComplete} = props;
    const [active, setActive] = useState(false);
    const [beerData, setBeerData] = useState({});


    const handlePhaseChange = async (e, processId, phaseIndex) => {
        await handleProcessChange(e, processId, phaseIndex)
    }

    const renderPhases = () => {
        return processData.phases.map((phase, i) => {
            let startTank = getTankDetails(phase.startTank);
            let endTank = phase.startTank === phase.endTank ? null : getTankDetails(phase.endTank);
            return <Phase phaseData={phase} style={{maxWidth: "100px", maxHeight: "100px"}} key={i} index={i}
                          tanks={{startTank, endTank}} handlePhaseChange={async (e, phaseIndex) => {
                if (closeOnComplete && e.target.name === "complete") {
                    let count = 0;
                    for (let el of processData.phases) {
                        count += el.complete ? 1 : 0;
                    }
                    if (count === processData.phases.length - 1 && e.target.checked) {
                        setActive(false)
                    }
                }
                await handlePhaseChange(e, processData._id, phaseIndex)
            }}/>
        })
    }

    return (
        !active ?
            <a className={"item"} onClick={async () => {
                const beer = await getBeerById(processData.contents);
                setBeerData(beer);
                setActive(!active);
            }}>
                <div className="content">
                    <div className="header">
                        {processData.name}
                    </div>
                </div>
            </a> :
            <div className={"item"}>
                <div className="content">
                    <div className="ui medium header" style={{color: "goldenrod"}}>{processData.name}</div>
                    <a style={{color: "grey"}}><i className={"ui right floated close large icon"} onClick={() => {
                        setActive(!active);
                    }}/></a>
                    <div className={"ui divider"}/>
                    <div className="ui small header">Details:</div>
                    <div className={"description"}>
                        <div className={"ui horizontal divider"}/>
                        <div className={"ui three stackable cards"}>
                            <ProcessDetail data={beerData.name} icon={"beer"} header={"Contents"} editable={false}/>
                            <ProcessDetail data={formatDate(processData.startDate)} icon={"calendar alternate outline"}
                                           header={"Process Start Date"} type={"date"} editable={true}
                                           handleProcessChange={(e) => handleProcessChange(e, processData._id)}/>
                            <ProcessDetail data={formatDate(processData.endDate)} icon={"calendar alternate"}
                                           header={"Process End Date"} type={"date"} editable={true}
                                           handleProcessChange={(e) => handleProcessChange(e, processData._id)}/>
                            <ProcessDetail data={processData.expectedYield} icon={"paper plane outline"}
                                           header={"Expected Yield"} type={"text"} editable={false}/>
                            <ProcessDetail data={processData.actualYield} icon={"paper plane"}
                                           header={"Actual Yield"} type={"text"} editable={true}
                                           handleProcessChange={(e) => handleProcessChange(e, processData._id)}/>
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
                        deleteProcess(processData._id)
                    }}><i className={"ui red trash icon"}/></div>

                </div>
            </div>
    );
}

export default Process;

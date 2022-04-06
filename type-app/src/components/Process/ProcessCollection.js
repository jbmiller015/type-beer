import React, {useEffect, useState} from 'react';
import {filterEntries, sortEntries} from "./ProcessFunctions";
import Process from "./Process";
import Shrugger from "../Messages/Shrugger";

const ProcessCollection = (props) => {
    const {
        header,
        shruggerMessage,
        color,
        processes,
        filter,
        sort,
        setError,
        getBeerById,
        getTankDetails,
        handleProcessChange,
        deleteProcess
    } = props;
    const [procs, setProcs] = useState(processes);

    useEffect(() => {
        let results = procs;
        if (filter !== null) {
            results = filterEntries(filter.query, procs, setError)
        }
        if (sort !== null) {
            results = sortEntries(sort.key, sort.direction, procs)
        }
        setProcs(results)
    }, [props]);


    const renderProcesses = () => {
        if (procs.length > 0) {
            return procs.map((process) => {
                let beer = getBeerById(process.contents)
                return <Process processData={process} beerData={beer}
                                getTankDetails={(tankId) => getTankDetails(tankId)}
                                handleProcessChange={async (e, processId, phaseIndex, choice) => {
                                    return await handleProcessChange(e, processId, phaseIndex, choice).then(data => {
                                        return data
                                    })
                                }}
                                deleteProcess={(processId) => {
                                    deleteProcess(processId)
                                }}
                                getBeerById={(beerId) => {
                                    return getBeerById(beerId)
                                }}/>
            })
        } else
            return <Shrugger message={shruggerMessage}/>
    }

    return (<div style={{
        maxWidth: "50%",
        left: "0",
        right: "0",
        marginLeft: "auto",
        marginRight: "auto"
    }}>
        <div className={"ui horizontal divider"}/>
        <div className={"ui large header"}>{header}</div>
        <div className="ui relaxed divided items" style={{
            borderStyle: "solid",
            borderRadius: "1%",
            borderWidth: "1px",
            borderColor: color,
            padding: "2%"
        }}>
            {renderProcesses()}
        </div>
    </div>)
}
export default ProcessCollection;

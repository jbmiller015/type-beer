import React from 'react';
import Process from "./Process";
import Shrugger from "../Messages/Shrugger";
import ProcessFilterButtons from "./ProcessFilterButtons";
import {formatDate} from "./ProcessFunctions";
import moment from "moment";

class ProcessCollection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeProcesses: this.props.activeProcesses,

            isLoaded: this.props.isLoaded,
            comps: null,
            defaultView: "active",
            color: '#fbbd08',
            visible: this.props.activeProcesses,
            shruggerMessage: ""
        }
    }


    filterEntries = (query) => {
        let [key, queryString] = query.split(' ', 2);
        if (query.charAt(0) === ':' && queryString) {
            key = key.substring(1);

            const matcher = new RegExp(queryString, 'ig');
            let result;
            try {
                result = this.state.procs.filter((process) => {
                    console.log(process)
                    return process[key].match(matcher)
                })
            } catch (err) {
                if (err instanceof TypeError) {
                    this.props.setError(`Unrecognized Type '${key}'`)
                } else {
                    this.props.setError(err.message)
                }
            }

            return result

        } else {
            const matcher = new RegExp(query, 'ig')
            return this.state.procs.filter((process) => {
                console.log(process)
                return process.name.match(matcher)
            })
        }

    }

    sortEntries = (key, direction) => {
        const sorted = this.state.procs.sort((a, b) => {
            return (a[key] > b[key] ? 1 : ((b[key] > a[key]) ? -1 : 0))
        })

        console.log(sorted)

        return direction === 'desc' ? sorted : sorted.reverse();
    }


    render() {
        console.log("render")
        console.log(this.state.activeProcesses)

    }
}

//export default ProcessCollection;

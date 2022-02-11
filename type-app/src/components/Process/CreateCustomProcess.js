import React, {useState} from 'react';
import PhaseField from "./PhaseField";

const CreateCustomProcess = (props) => {

    const {contents, startDate, validatePhase} = props;
    const [phases, setPhases] = useState([]);
    const [endDate, setEndDate] = useState(null);


    const handleFieldChange = (index, e) => {
        let {name, value, checked} = e.target;
        if (name === "complete") {
            value = checked
        }
        let tempPhases = [phases];
        if (name === "submit" && value.phaseName === "Transfer") {
            tempPhases[index] = value;
            for (let i = index; i < phases.length; i++) {
                tempPhases[i].startTank = value.endTank
                tempPhases[i].endTank = value.endTank
            }
        } else if (name === "submit" && value.phaseName !== "Transfer") {
            tempPhases[index] = value;
            //{phaseName, startDate, endDate, startTank, endTank}
            tempPhases.forEach((phase) => {
                    phase.startTank = value.startTank
                    phase.endTank = value.startTank
            })
        } else {
            tempPhases[index] = value;
        }
        setPhases([...tempPhases])
    }

    const addPhaseButton = () => {
        return (<div className="field">
            <div className="phase button" style={{alignItems: 'center', justifyContent: "center", display: 'flex'}}>
                <div className="ui primary button" onClick={addPhase}>
                    Add Phase
                </div>
            </div>
        </div>);
    }


    const phaseFields = () => {
        return phases.map((phase, i) => {
            return <PhaseField
                phaseData={{
                    phase,
                    previousPhase: i > 0 ? phases[i - 1] : null,
                    startDate: i > 0 ? null : startDate
                }}
                handleFieldChange={(index,e)=>handleFieldChange(index,e)}
                key={i} index={i}
                removePhase={removePhase}
                validatePhase={validatePhase}
            />
        });
    }

    const addPhase = (e) => {
        e.preventDefault()
        const size = phases.length;
        if (phases.length > 0) {
            const newPhase = {
                startDate: phases[size - 1].endDate,
                startTank: phases[size - 1].endTank,
                endTank: phases[size - 1].endTank
            }
            setPhases([...phases, newPhase]);
        } else {
            setPhases([...phases, {startDate}])
        }
    }

    const removePhase = (index, e) => {
        e.preventDefault();
        let tempPhases = [...phases];
        phases.splice(index, 1);
        setPhases([...tempPhases]);
    }


    const phaseCollection = () => {
        console.log("phasecollection")
        return (phases.length >= 1) ?
            <div className={"phases"} style={{padding: "1%"/**, minWidth: screenSize()*/}}>
                <div className="form" style={{padding: "2%"}}>
                    <form className="ui form">
                        {phaseFields()}
                    </form>
                </div>
            </div> : null
    }

    return (<div>
        <div className={"ui form"}>
        {phaseCollection()}
        {addPhaseButton()}
        </div>
    </div>);
}
export default CreateCustomProcess;

import React, {useState} from 'react';
import PhaseField from "./PhaseField";

const CreateCustomProcess = (props) => {

    const {contents, startDate} = props;
    const [phases, setPhases] = useState([]);
    const [endDate, setEndDate] = useState(null);


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
        console.log(this.state.phases)
        return this.state.phases.map((phase, i) => {
            return <PhaseField
                phaseData={{
                    phase,
                    previousPhase: i > 0 ? this.state.phases[i - 1] : null,
                    startDate: i > 0 ? null : this.state.startDate
                }}
                key={i} index={i}
                handleFieldChange={this.handleFieldChange}
                removePhase={this.removePhase}
                validatePhase={this.validatePhase}
            />
        });
    }

    const addPhase = (e) => {
        e.preventDefault()
        const size = phases.length;
        if (this.state.phases.length > 0) {
            const newPhase = {
                startDate: this.state.phases[size - 1].endDate,
                startTank: this.state.phases[size - 1].endTank,
                endTank: this.state.phases[size - 1].endTank
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
        this.setState({phases});
    }


    const phaseCollection = () => {
        console.log("phasecollection")
        return (this.state.phases.length >= 1 && !this.state.showDefault && !this.state.showCopyProcess) ?
            <div className={"phases"} style={{padding: "1%", minWidth: this.screenSize()}}>
                <div className="form" style={{padding: "2%"}}>
                    <form className="ui form">
                        {this.phaseFields()}
                        {this.state.phases.length > 0 ? this.phaseButton() : null}
                    </form>
                </div>
            </div> : null
    }

    return (<div>
        {phaseCollection()}
        {addPhaseButton()}
    </div>);
}
export default CreateCustomProcess;

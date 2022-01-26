import React from "react";

const TankContent = ({data}) => {
    console.log(data)

    const {tankData, process} = data;

    const breadcrumbs = () => {
        if (process) {
            return process.phases.map((phase, i) => {
                console.log(phase)
                return (
                    <div className={process.activePhase.phaseName === phase.phaseName?"active section": "section"}>{`${phase.phaseName}${process.phases.length - 1 > i ? "-->" : ""}`}</div>
                );
            })
        }

    }

    return (
        <div className="content">
            <p>Beer: {process && process.contents.name ? process.contents.name : null}</p>
            <p>Style: {process && process.contents.style !== null ? process.contents.style : null}</p>
            <p>Current Phase: {process && process.activePhase ? process.activePhase.name : null}</p>
            <p>Tank Size: {tankData.size || null}</p>
            <div className="ui breadcrumb">
                {breadcrumbs()}
            </div>
        </div>
    );
}
export default TankContent;

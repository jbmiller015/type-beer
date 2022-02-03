import React, {useState} from 'react';

const CalendarModal = (props) => {
    const {showModal, closeModal} = props;
    const {process, tank} = props.modalData;

    const modal = () => {

        return process && tank ?
            <div className={`ui ${showModal ? "active" : ""} modal`} style={{
                zIndex: "1000",
                position: "fixed",
                left: "0",
                right: "0",
                marginLeft: "auto",
                marginRight: "auto"
            }}>
                <div className="header">{process.name}
                    <div className={"ui right floated  button"} onClick={() => closeModal()}><i
                        className={"close icon"}/></div>
                </div>
                <div className="scrolling content">
                    <p>{process.contents}</p>
                    <p>{process.startDate}</p>
                    <p>{process.endDate}</p>
                    <p>Phases:</p>
                    {process.phases.map((phase, i) => {
                        return (<div key={i}>
                            <p>{phase.phaseName}</p>
                        </div>)
                    })}
                    <p>{tank.name}</p>
                </div>
            </div> : null
    }
    return (<div>{modal()}</div>);
}
export default CalendarModal;

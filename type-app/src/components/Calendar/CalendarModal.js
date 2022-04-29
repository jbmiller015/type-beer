import React, {useCallback, useEffect, useState} from 'react';
import moment from "moment";

const CalendarModal = (props) => {
    const {showModal, closeModal} = props;
    const {process, tank, date, beer} = props.modalData;
    const [activePhase, setActivePhase] = useState(null);

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            closeModal()
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);


    const formatDate = (date) => {

        return moment(date.split("T", 1)[0]).format("M/D/YY")
    }


    useEffect(() => {
        if (process) {
            for (let el of process.phases) {
                let startDate = el.startDate.split("T", 1)[0];
                let endDate = el.endDate.split("T", 1)[0];
                let active = (moment(date).startOf('date').isBetween(moment(startDate).startOf('date'), moment(endDate).startOf('date'), undefined, '[]'))
                if (active) {
                    setActivePhase(el);
                }
            }
        }
    })


    const breadcrumbs = () => {
        if (process && activePhase) {
            return process.phases.map((phase, i) => {
                return (
                    <div
                        className={activePhase.phaseName === phase.phaseName ? "active section" : "section"}>{`${phase.phaseName}${process.phases.length - 1 > i ? "-->" : ""}`}</div>
                );
            })
        }

    }

    const modal = () => {

        return process && tank && activePhase && beer ?
            <div className={`ui ${showModal ? "active" : ""} modal`} style={{
                zIndex: "1000",
                position: "fixed",
                left: "0",
                right: "0",
                marginLeft: "auto",
                marginRight: "auto",
            }}>
                <div className="header">{process.name + " : " + activePhase.phaseName}
                    <div className={"ui right floated icon button"} onClick={() => closeModal()}><i
                        className={"close icon"}/></div>
                </div>
                <div className="scrolling content">
                    <h4 className="ui horizontal divider header">
                        <i className="tasks icon"/>
                        Phase Details
                    </h4>
                    <div className="ui divided list">
                        <div className="item">
                            <div className="header">
                                Contents:
                            </div>
                            <div className="content">
                                {beer.name}
                            </div>
                        </div>
                        <div className="item">
                            <div className="header">
                                Start Date:
                            </div>
                            <div className="content">
                                {formatDate(activePhase.startDate)}
                            </div>
                        </div>
                        <div className="item">
                            <div className="header">
                                End Dates:
                            </div>
                            <div className="content">
                                {formatDate(activePhase.endDate)}
                            </div>
                        </div>
                        <div className="item">
                            <div className="header">
                                Current Tank:
                            </div>
                            <div className="content">
                                {tank.name}
                            </div>
                        </div>
                        <div className="item">
                            <div className="header">
                                Process Overview:
                            </div>
                            <div className="content">
                                <div className="ui breadcrumb">
                                    {breadcrumbs()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            : null
    }
    return (
        <div>{modal()}</div>
    );
}
export default CalendarModal;

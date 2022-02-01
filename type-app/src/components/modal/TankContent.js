import React, {useEffect, useState} from "react";
import moment from "moment";

const TankContent = ({data, getBeerById}) => {

    const {tankData, process} = data;
    const [beer, setBeer] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const getBeer = async () => {
            if (process) {
                await getBeerById(process.contents).then(res => {
                    setBeer(res);
                }).catch(err => {
                    console.log(err);
                })
            }
        }
        getBeer()
        setLoaded(true);
    }, []);

    const breadcrumbs = () => {
        if (process) {
            return process.phases.map((phase, i) => {
                return (
                    <div
                        className={process.activePhase.phaseName === phase.phaseName ? "active section" : "section"}>{`${phase.phaseName}${process.phases.length - 1 > i ? "-->" : ""}`}</div>
                );
            })
        }

    }

    if (!loaded) {
        return (
            <div className="ui active centered inline inverted dimmer">
                <div className="ui big text loader">Loading</div>
            </div>
        );
    } else {
        return (
            <div className="content">
                <h4 className="ui horizontal divider header">
                    <i className="calendar alternate outline icon"/>
                    Process Info
                </h4>
                <div className="ui divided list">
                    <div className="item">
                        <div className="header">
                            Beer:
                        </div>
                        <div className="content">
                            {process && beer ? beer.name : null}
                        </div>
                    </div>
                    <div className="item">
                        <div className="header">
                            Current Phase:
                        </div>
                        <div className="content">
                            {process && process.activePhase ? process.activePhase.phaseName : null}
                        </div>
                    </div>
                    <div className="item">
                        <div className="header">
                            Start Date:
                        </div>
                        <div className="content">
                            {process && process.activePhase ? new Date(process.activePhase.startDate).toLocaleDateString() : null}
                        </div>
                    </div>
                    <div className="item">
                        <div className="header">
                            End Date:
                        </div>
                        <div className="content">
                            {process && process.activePhase ? new Date(process.activePhase.endDate).toLocaleDateString() : null}
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
                <h4 className="ui horizontal divider header">
                    <i className="bar chart icon"/>
                    Specifications
                </h4>
                <div className="ui divided list">
                    <div className="item">
                        <div className="header">
                            Tank Size:
                        </div>
                        <div className="content">
                            {tankData.size || null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default TankContent;

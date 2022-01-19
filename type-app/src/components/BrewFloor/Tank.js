import React, {useEffect, useState} from 'react';
import tankOverlay from '../../media/tankwwindow.png';
import moment from "moment";
//TODO: Combine Process data and Tank
const Tank = (props) => {

    const [className, setClassName] = useState("card");
    const {currPhase, currPhaseDate, fill, name} = props.tankData;
    const {contents} = props
    const process = props.process;

    useEffect(() => {
        if (process && process.endDate) {
            moment().diff(process.endDate) > 0 ? setClassName("red card") : setClassName("green card")
        }
    })


    const imageWrapper = {
        backgroundColor: (process && fill) ? '#DAA520' : '',
        backgroundSize: '70% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    };

    const cardStyle = {
        marginBottom: "2%"
    };

    const phase = () => {
        if (process) {
            return process.activePhase.phaseName ? process.activePhase.phaseName : ""
        } else {
            return "Empty"
        }
    }

    const date = () => {
        if (process) {
            return moment(process.endDate).fromNow() ? moment(process.endDate).fromNow() : ""
        }
    }


    return (
        <div className={"item"}>
            <div className={"ui cards"} style={cardStyle}>
                <div className={className}>
                    <div className="ui basic big top center aligned attached label" style={{zIndex: "1"}}>{name}</div>
                    <div className={"image"} style={imageWrapper}>
                        <img alt="tankOverlay" src={tankOverlay}/>
                    </div>
                    <div className={"content"}>
                        <div className={"center aligned header"}>{contents && contents.name ? contents.name : ""}</div>
                        <div
                            className={"center aligned meta"}>{date()}</div>
                    </div>
                    <div className={"center aligned extra content"}>
                        <span style={{fontSize: "medium"}}>{phase()}</span>
                    </div>
                    {props.detailButtonVisible ?
                        <button className="ui bottom attached button"
                                onClick={() => props.loadData(props.tankData, process)}>
                            <i className="setting icon"/>
                            Details
                        </button> : null}
                </div>
            </div>
        </div>
    );
};

export default Tank;


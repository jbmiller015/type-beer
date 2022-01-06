import React, {useEffect, useState} from 'react';
import tankOverlay from '../../media/tankwwindow.png';
import moment from "moment";

const Tank = (props) => {

    const [className, setClassName] = useState("card");
    const {currPhase, currPhaseDate, fill, name} = props.tankData;
    const {contents} = props

    useEffect(() => {
        if (currPhaseDate) {
            moment().diff(currPhaseDate) > 0 ? setClassName("red card") : setClassName("green card")
        }
    })


    const imageWrapper = {
        backgroundColor: (contents && fill) ? '#DAA520' : '',
        backgroundSize: '70% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    };

    const cardStyle = {
        marginBottom: "2%"
    };

    const phase = () => {
        if (contents) {
            return currPhase ? currPhase : ""
        } else {
            return "Empty"
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
                            className={"center aligned meta"}>{moment(currPhaseDate).fromNow() ? moment(currPhaseDate).fromNow() : ""}</div>
                    </div>
                    <div className={"center aligned extra content"}>
                        <span style={{fontSize: "medium"}}>{phase()}</span>
                    </div>
                    {props.detailButtonVisible ?
                        <button className="ui bottom attached button" onClick={() => props.loadData(props.tankData)}>
                            <i className="setting icon"/>
                            Details
                        </button> : null}
                </div>
            </div>
        </div>
    );
};

export default Tank;


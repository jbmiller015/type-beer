import React, {useEffect, useState} from 'react';
import tankOverlay from '../../media/tankwwindow.png';
import moment from "moment";

const Tank = (props) => {

    const [className, setClassName] = useState("card");
    const {currPhase, currPhaseDate, contents, fill, name} = props.tankData;

    useEffect(() => {
        if (currPhaseDate) {
            moment().diff(currPhaseDate) > 0 ? setClassName("red card") : setClassName("green card")
        }
    })


    const imageWrapper = {
        backgroundColor: (contents && !contents.image && fill) ? '#DAA520' : '',
        backgroundImage: `url(${contents ? contents.image : ''})`,
        backgroundSize: '70% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    };

    const cardStyle = {
        marginBottom: "2%"
    };


    return (
        <div className={"item"}>
            <div className={"ui cards"} style={cardStyle}>
                <div className={className}>
                    <div className="ui basic big top attached label" style={{zIndex: "1"}}>{name}</div>
                    <div className={"image"} style={imageWrapper}>
                        <img alt="tankOverlay" src={tankOverlay}/>
                    </div>
                    <div className={"content"}>
                        <div className={"header"}>{contents && contents.name ? contents.name : ""}</div>
                        <div
                            className={"meta"}>{moment(currPhaseDate).fromNow() ? moment(currPhaseDate).fromNow() : ""}</div>
                    </div>
                    <div className={"extra content"}>
                        <span style={{fontSize: "medium"}}>{currPhase ? currPhase : ""}</span>
                    </div>
                    <button className="ui bottom attached button" onClick={() => props.loadData(props.tankData)}>
                        <i className="setting icon"/>
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Tank;


import React, {useEffect, useState} from 'react';
import tankOverlay from '../../media/tankwwindow.png';
import moment from "moment";

const Beer = (props) => {
    const {name, style, image} = props.beerData;

    const imageWrapper = {
        backgroundColor: !image ? '#DAA520' : '',
        backgroundImage: `url(${image ? image : ''})`,
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
                <div className="card">
                    <div className={"image"} style={imageWrapper}>
                        <img alt="tankOverlay" src={tankOverlay}/>
                    </div>
                    <div className={"content"}>
                        <div className={"header"}>{name ? name : ""}</div>
                        <div className={"meta"}>{style ? style : ""}</div>
                    </div>
                    <button className="ui bottom attached button" onClick={() => props.loadData(props.beerData)}>
                        <i className="setting icon"/>
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Beer;


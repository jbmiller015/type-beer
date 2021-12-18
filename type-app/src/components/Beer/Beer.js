import React from 'react';
import beerOverlay from '../../media/beerwwindow.png';

const Beer = (props) => {
    const {name, style, image} = props.beerData;

    const imageWrapper = {
        backgroundColor: !image ? '#DAA520' : '',
        backgroundImage: `url(${image ? image : ''})`,
        backgroundSize: '70% 70%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center bottom',
    };

    const cardStyle = {
        marginBottom: "2%"
    };


    return (
        <div className={"item"}>
            <div className={"ui cards"} style={cardStyle}>
                <div className="card">
                    <div className={"image"} style={imageWrapper}>
                        <img alt="tankOverlay" src={beerOverlay}/>
                    </div>
                    <div className={"content"}>
                        <div className={"center aligned header"}>{name ? name : ""}</div>
                        <div className={"center aligned meta"}>{style ? style : ""}</div>
                    </div>
                    {props.detailButtonVisible ?
                        <button className="ui bottom attached button" onClick={() => props.loadData(props.beerData)}>
                            <i className="setting icon"/>
                            Details
                        </button> : null}
                </div>
            </div>
        </div>
    );
};

export default Beer;


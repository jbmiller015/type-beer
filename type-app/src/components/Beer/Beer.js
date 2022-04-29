import React, {useCallback, useEffect, useState} from 'react';
import beerOverlay from '../../media/beerwwindow.png';

const Beer = (props) => {
    const {name, style, desc} = props.beerData;

    const [focus, setFocus] = useState(false);

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            setFocus(false)
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);

    const imageWrapper = {
        backgroundColor: '#DAA520',
        backgroundSize: '70% 70%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center bottom',
    };

    const cardStyle = {
        marginTop: "7%"
    };


    return (
        <div className={"item"}>
            <div className={"ui cards"}>
                <div className="card" style={cardStyle}>
                    <div className={"image"} style={imageWrapper}>
                        <img alt="beerOverlay" src={beerOverlay}/>
                    </div>
                    <div className={"content"}>
                        <div className={"center aligned header"}>{name ? name : ""}</div>
                        <div className={"center aligned meta"}>{style ? style : ""}</div>
                    </div>
                    {props.detailButtonVisible ?
                        <button className="ui bottom attached button"
                                onClick={() => props.loadData(props.beerData)}>
                            <i className="setting icon"/>
                            Details
                        </button> : null}
                </div>
            </div>
        </div>
    );
};

export default Beer;


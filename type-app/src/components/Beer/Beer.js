import React, {useState} from 'react';
import beerOverlay from '../../media/beerwwindow.png';

const Beer = (props) => {
    const {name, style, desc} = props.beerData;

    const [focus, setFocus] = useState(false);

    const imageWrapper = {
        backgroundColor: '#DAA520',
        backgroundSize: '70% 70%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center bottom',
    };

    const cardStyle = {
        position: "absolute",
        marginBottom: "2%",
        overflow: "visible",
        zIndex: 999,
        maxWidth: "90%"
    };


    return (
        <div className={"two wide column"}>
            {!focus ? <div className={"ui segment"} style={{textAlign: "center"}} onClick={() => {
                    setFocus(!focus)
                }}>
                    {name}
                </div> :
                <div className={"ui cards"}>
                    <div className="card" style={cardStyle}>
                        <div className={"ui animated fade basic red top attached icon button"} onClick={() => {
                            setFocus(!focus)
                        }}>
                            <div className={"visible content"}><i className={"close icon"}/></div>
                            <div className={"hidden content"}>Close</div>

                        </div>
                        <div className={"image"} style={imageWrapper}>
                            <img alt="tankOverlay" src={beerOverlay}/>
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
                </div>}
        </div>
    );
};

export default Beer;


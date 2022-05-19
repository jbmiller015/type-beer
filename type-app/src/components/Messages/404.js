import React from 'react';
import fourOfourwwindow from '../../media/fourOfourwwindow.png'

const imageWrapper = {
    backgroundColor: '#DAA520',
    backgroundSize: '70% 70%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom',
    maxHeight: "20%",
    maxWidth: "30%",
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto"
};

const fourOfour = () => {
    return (<div className={"ui basic center aligned segment"}>
        <div className={"ui horizontal divider"}/>
        <div className="ui huge header">404</div>
        <div className="ui medium header">Uh oh...</div>
        <div className="ui medium header">Page not found.</div>
        <img style={imageWrapper} className="ui fluid image" src={fourOfourwwindow}/>
    </div>);
}
export default fourOfour;

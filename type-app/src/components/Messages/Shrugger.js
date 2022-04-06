import React from 'react';

const Shrugger = (props) => {
    const {message} = props;
    return (<div style={{
        left: "0",
        right: "0",
        marginLeft: "auto",
        marginRight: "auto"
    }}>{`${message} ¯\\_(ツ)_/¯`}</div>);
}
export default Shrugger;

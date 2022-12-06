import React from "react";
import {useHistory} from "react-router-dom";

const GoToCreate = (props) => {
    const {destination, buttonText} = props;
    const history = useHistory();
    return (<div style={{
        textAlign: "center",
        verticalAlign: "middle",
        horizontalAlign: "middle"
    }}>
        <div className="description">
            <h3 className="ui header">{`Looks like you haven't created any ${destination}${destination.charAt(destination.length-1) === 's' ? "es" : "s"}.`}</h3>
        </div>
        <div className="ui yellow button" style={{marginTop: "2%"}} onClick={() => history.push(`/create/${destination}`)}>
            {`Create ${destination.charAt(0).toUpperCase() + destination.slice(1)}`}
            <i className="ui icon arrow right"/>
        </div>
    </div>)
}
export default GoToCreate;

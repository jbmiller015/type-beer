import React from "react";
import {useNavigate} from "react-router-dom";

const GoToCreate = (props) => {
    const {destination, buttonText} = props;
    const navigate = useNavigate();
    return (<div style={{
        textAlign: "center",
        verticalAlign: "middle",
        horizontalAlign: "middle"
    }}>
        <div className="description">
            <h3 className="ui header">{`Looks like you haven't created any ${destination}${destination.charAt(destination.length-1) === 's' ? "es" : "s"}.`}</h3>
        </div>
        <div className="ui yellow button" style={{marginTop: "2%"}} onClick={() => navigate(`/create/${destination}`)}>
            {`Create ${destination.charAt(0).toUpperCase() + destination.slice(1)}`}
            <i className="ui icon arrow right"/>
        </div>
    </div>)
}
export default GoToCreate;

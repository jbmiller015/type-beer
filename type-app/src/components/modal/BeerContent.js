import React from "react";

const BeerContent = (props) =>{
    return(<div className="content">
        <p>Beer: {props.name ? props.name : null}</p>
        <p>Style: {props.style ? props.style : null}</p>
        <p>Description: {props.desc || null}</p>
    </div>);
}
export default BeerContent;

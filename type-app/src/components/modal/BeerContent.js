import React from "react";

const BeerContent = ({data}) => {

    return (
        <div className="content">
            <p>Beer: {data.name ? data.name : null}</p>
            <p>Style: {data.style ? data.style : null}</p>
            <p>Description: {data.desc || null}</p>
        </div>
    );
}
export default BeerContent;

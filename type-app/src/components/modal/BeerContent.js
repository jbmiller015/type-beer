import React from "react";

const BeerContent = ({data}) => {

    return (
        <div className="content">
            <h4 className="ui horizontal divider header">
                <i className="beer icon"/>
                Details
            </h4>
            <div className="ui divided list">
                <div className="item">
                    <div className="header">
                        Style:
                    </div>
                    <div className="content">
                        {data.style ? data.style : null}
                    </div>
                </div>
            </div>
            <h4 className="ui horizontal divider header">
                <i className="clipboard icon"/>
                Extra
            </h4>
            <div className="ui divided list">
                <div className="item">
                    <div className="header">
                        Notes / Description:
                    </div>
                    <div className="content">
                        {data.desc || null}
                    </div>
                </div>
            </div>

        </div>
    );
}
export default BeerContent;

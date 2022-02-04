import React from 'react';

const ProcessDetail = ({icon, header, data}) => {
    return (<div className={"ui centered card"}>
        <div className="content">
            <div className={"ui center aligned small header"}>
                <i className={`ui ${icon} icon`}/>
                {header}:
            </div>
        </div>
        <div className="content">
            <div className={"ui center aligned description"}>
                {data}
            </div>
        </div>
    </div>);
}
export default ProcessDetail;

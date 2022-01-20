import React from 'react';

const Date = (props) => {
    //TODO: use date as child prop, not number. Only show day.
    const d = props.children;
    return (
        <div className={"column"} style={{padding: "5px"}}>
            <div className={"ui basic segment"} style={{padding: "0"}}>
                <p>{d}</p>
            </div>
            <div className={"ui raised segments"}>
                <div className={"ui segment"}/>
                <div className={"ui segment"}/>
                <div className={"ui segment"}/>
            </div>
        </div>
    );
}
export default Date;

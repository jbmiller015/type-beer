import React from "react";

const Message = (props) => {
    return (
        <div className={`ui ${props.messageType} message`}>
            <i className="close icon" onClick={props.onClose}/>
            <div className={"header"}>
                {props.message}
            </div>
        </div>
    );
}
export default Message;

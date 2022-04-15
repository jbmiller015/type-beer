import React from "react";

const Message = (props) => {
    return (
        <div className={"messageContainer"} style={{
            display: "flex",
            justifyContent: "center"
        }}>
            <div style={{
                marginInline: "6%",
                paddingInline: "5%",
                width: "auto",
                display: "inline-flex",
                justifyContent: "center",
                flexDirection: "row"
            }}
                 className={`ui ${props.messageType} message`}>
                <i className="close icon" onClick={props.onClose}/>
                <div className={"header"}>
                    {props.message}
                </div>
            </div>
        </div>
    );
}
export default Message;

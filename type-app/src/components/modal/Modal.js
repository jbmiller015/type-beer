import React, {Component} from "react";
import modal from "./Modal.css"

class Modal extends Component {

    onClose = event => {
        this.props.onClose && this.props.onClose(event);
    };


    render() {
        if (!this.props.show) {
            return null;
        }
        const {data} = this.props;

        return (
            <div className="modal" id="modal">
                <h2>{data.name}</h2>
                <div className="content">
                    <p>Beer: {data.contents.name}</p>
                    <p>Style: {data.contents.style}</p>
                    <p>Current Phase: {data.currPhase}</p>
                    <p>Date: {new Intl.DateTimeFormat('en-US').format(new Date(data.currPhaseDate))}<br/>
                        Time: {new Intl.DateTimeFormat('en-US', {hour: '2-digit', minute: '2-digit'})
                            .format(new Date(data.currPhaseDate))}</p>
                    <p>Next Phase: {data.nextPhase}</p>
                    <p>Tank Size: {data.size}</p>
                </div>
                <img style={{maxWidth: "100px"}} src={data.contents.image}/>
                <div className="actions">
                    <button className="toggle-button" onClick={this.onClose}>
                        Close
                    </button>
                    <button className="toggle-button" onClick={this.props.deleteTank}>
                        Delete
                    </button>
                </div>
            </div>
        );
    }


}

export default Modal;

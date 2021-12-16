import React, {Component} from "react";
import EditTank from "../BrewFloor/EditTank";
import TankComponent from "./TankContent";
import TankContent from "./TankContent";
import BeerContent from "./BeerContent";

class Modal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            verify: false,
            data: this.props.data,
        }
    }

    onClose = event => {
        this.props.onClose && this.props.onClose(event);
    };

    handleChange = e => {
        const {name, value} = e.target;
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                [name]: value
            }
        }))
    };

    //TODO: Look at how this is being submitted
    setContents = content => {
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                contents: content
            }
        }));
    };

    //TODO: Implement edit beer
    setBeer = () =>{

    }

    buttons = () => {
        if (this.state.edit) {
            return (
                <div className="actions">
                    <button className="ui grey button" onClick={() => this.setState({edit: false})}>
                        Cancel
                    </button>
                    <button className="ui right floated green button"
                            onClick={(e) => {
                                this.props.editTank(this.props.data._id, this.state.data);
                                this.setState({edit: false});
                                this.onClose(e);
                            }}>
                        Submit
                    </button>
                </div>
            )
        } else if (this.state.verify) {
            return (
                <div className="actions"><h4>Are You Sure?</h4>
                    <button className="ui red button" onClick={(e) => {
                        this.props.deleteTank(this.props.data._id);
                        this.setState({verify: false})
                        this.onClose(e);
                    }}>
                        Delete
                    </button>
                    <button className="ui grey button" onClick={(e) => {
                        this.setState({verify: false})
                    }}>
                        Cancel
                    </button>
                </div>
            )
        } else {
            return (
                <div className="actions">
                    <button className="ui grey button" onClick={this.onClose}>
                        Close
                    </button>
                    <button className="ui grey button" onClick={() => this.setState({edit: true})}>
                        Edit
                    </button>
                    <button className="ui right floated red button" onClick={() =>
                        this.setState({verify: true})}>
                        Delete
                    </button>
                </div>
            )
        }
    }
    content = () => {
        console.log(this.props.tankModal)
        return this.props.tankModal ? <TankContent data={this.state.data}/> :
            <BeerContent data={this.state.data}/>;
    };

    render() {
        if (!this.props.show) {
            return null;
        }
        const {data} = this.props;

        return (
            <div style={this.state.edit ? {height:"60%"}:{height: "auto"}} className="modal" id="modal">
                <h2>{data.name}</h2>
                {!this.state.edit ? this.content()
                    :
                    <div className="content">
                        <EditTank passed={data} handleChange={this.handleChange} setConents={this.setContents}/>
                    </div>
                }
                {data.contents && data.contents.image ?
                    <img alt="contents" style={{maxWidth: "100px"}} src={data.contents.image}/> : null}
                {this.buttons()}
            </div>
        );
    }


}

export default Modal;

import React, {Component} from "react";
import EditTank from "./EditTank";
import TankComponent from "./TankContent";
import TankContent from "./TankContent";
import BeerContent from "./BeerContent";
import EditBeer from "./EditBeer";

class Modal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            verify: false,
            data: this.props.data,
            editData: {}
        }
    }

    componentWillUnmount() {
        this.setState({data: null, editData: null})
    }

    onClose = event => {
        this.props.onClose && this.props.onClose(event);
    };

    handleEditChange = e => {
        const {name, value} = e.target;
        this.setState(prevState => ({
            editData: {
                ...prevState.editData,
                [name]: value
            }
        }))
    };

    setEditContents = content => {
        this.setState(prevState => ({
            editData: {
                ...prevState.editData,
                contents: content
            }
        }));
    };

    buttons = () => {
        if (this.state.edit) {
            return (
                <div className="actions">
                    <button className="ui grey button" onClick={() => this.setState({edit: false, editData: null})}>
                        Cancel
                    </button>
                    <button className="ui right floated green button"
                            onClick={async (e) => {
                                this.props.tankModal ? await this.props.editTank(this.props.data._id, this.state.editData) : await this.props.editBeer(this.props.data._id, this.state.editData);
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
                    <button className="ui red button" onClick={async (e) => {
                        console.log("I'm sure")
                        this.props.tankModal ? await this.props.deleteTank(this.props.data._id) : await this.props.deleteBeer(this.props.data._id);
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
                    <button className="ui grey button"
                            onClick={() => this.setState({edit: true, editData: this.state.data})}>
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
        return this.props.tankModal ? <TankContent data={this.state.data}/> :
            <BeerContent data={this.state.data}/>;
    };

    editContent = () => {
        return (<div className="content">
                {this.props.tankModal ?
                    <EditTank passed={this.props.data} handleChange={this.handleEditChange}
                              setConents={this.setEditContents}/> :
                    <EditBeer passed={this.props.data} handleChange={this.handleEditChange}/>}
            </div>
        )
    };

    render() {
        if (!this.props.show) {
            return null;
        }
        const {data} = this.props;

        return (
            <div style={this.state.edit ? {height: "60%"} : {height: "auto"}} className="modal" id="modal">
                <h2>{data.name}</h2>
                {this.state.edit ?
                    this.editContent()
                    :
                    this.content()}
                {data.contents && data.contents.image ?
                    <img alt="contents" style={{maxWidth: "100px"}} src={data.contents.image}/> : null}
                {this.buttons()}
            </div>
        );
    }


}

export default Modal;

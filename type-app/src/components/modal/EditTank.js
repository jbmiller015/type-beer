import React from 'react';
import Dropdown from "../Fields/Dropdown";

class EditTank extends React.Component {

    render() {
        return (
            <div>
                <form className="ui form">
                    <div className="field">
                        <label>Tank Name: {this.props.passed.name}</label>
                        <input type="text" name="name" onChange={this.props.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Tank Size: {this.props.passed.size}</label>
                        <input type="text" name="size" onChange={this.props.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Tank Type: {this.props.passed.size}</label>
                        <div className="ui action input">
                            <select className="ui dropdown" name="tankType" onChange={this.props.handleChange}>
                                <option defaultValue="" hidden>Choose Type</option>
                                <option name="tankType" value="brite">Brite</option>
                                <option name="tankType" value="fermenter">Fermenter</option>
                                <option name="tankType" value="kettle">Kettle</option>
                                <option name="tankType" value="barrel">Barrel</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default EditTank;

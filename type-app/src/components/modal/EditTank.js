import React from 'react';
import Dropdown from "../Fields/Dropdown";

class EditTank extends React.Component {

    setContents = content => {
        this.props.setConents(content)
    };

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
                            <select className="ui compact selection dropdown">
                                <option selected="Fermenter" value="Fermenter">Fermenter</option>
                                <option selected="" value="Brite">Brite</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default EditTank;

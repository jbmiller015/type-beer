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
                        <Dropdown label="Select Tank Contents"
                                  onSelectedChange={this.setContents}
                                  url="beer"/>
                    </div>
                    <div className="field">
                        <div className="ui checkbox">
                            <input type="checkbox" name="fill" tabIndex="0"
                                   onChange={this.props.handleChange}
                                   defaultChecked={this.props.passed.fill}/>
                            <label>Filled</label>
                        </div>
                    </div>
                    <div className="field">
                        <label>Fill Date: {this.props.passed.fillDate}</label>
                        <input type="datetime-local" name="fillDate"
                               onChange={this.props.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Current Phase: {this.props.passed.currPhase}</label>
                        <input type="text" name="currPhase"
                               onChange={this.props.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Next Phase: {this.props.passed.nextPhase}</label>
                        <input type="text" name="nextPhase" onChange={this.props.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Next Phase: {this.props.passed.currPhaseDate}</label>
                        <input type="datetime-local" name="currPhaseDate"
                               onChange={this.props.handleChange}/>
                    </div>
                </form>
            </div>
        );
    }
}

export default EditTank;

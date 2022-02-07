import React from 'react';

class EditBeer extends React.Component {


    render() {
        return (
            <div>
                <form className="ui form">
                    <div className="field">
                        <label>Name: {this.props.passed.name}</label>
                        <input type="text" name="name"
                               onChange={this.props.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Style: {this.props.passed.style}</label>
                        <input type="text" name="style"
                               onChange={this.props.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Description: </label>
                        <textarea name="desc" placeholder={this.props.passed.desc ? this.props.passed.desc : ""}
                                  onChange={this.props.handleChange}/>
                    </div>
                </form>
            </div>
        );
    }
}

export default EditBeer;

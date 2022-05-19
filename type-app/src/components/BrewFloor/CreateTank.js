import React from 'react';
import typeApi from '../../api/type-server'
import NavComponent from "../NavComponent";
import Tank from "./Tank";


class CreateTank extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            name: "",
            size: "",
            tankType: "",
            showExample: false
        }
    }


    handleChange = e => {
        let {name, value} = e.target;
        this.setState({
            [name]: value,
            showExample: true
        })
    };

    onFormSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name: this.state.name,
            size: this.state.size,
            tankType: this.state.tankType
        }


        await typeApi.post('/tank', formData)
            .then(res =>
                this.props.history.push('/'))
            .catch(err => {
                console.error(err)
            });


    };


    render() {
        return (
            <div>
                <NavComponent tanks={false}/>
                <div className="ui horizontal divider"/>
                <div className="container"
                     style={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center"}}>
                    <div className="form" style={{padding: "2%"}}>
                        <form className="ui form" onSubmit={this.onFormSubmit}>
                            <div className="required field">
                                <label>Tank Name:</label>
                                <input type="text" name="name" onChange={this.handleChange}/>
                            </div>
                            <div className="required field">
                                <label>Tank Size:</label>
                                <input type="text" name="size" onChange={this.handleChange}/>
                            </div>
                            <div className="required field">
                                <label>Tank Type:</label>
                                <select className="ui dropdown" name="tankType" onChange={this.handleChange}>
                                    <option defaultValue="" hidden>Choose Type</option>
                                    <option name="tankType" value="brite">Brite</option>
                                    <option name="tankType" value="fermenter">Fermenter</option>
                                    <option name="tankType" value="kettle">Kettle</option>
                                    <option name="tankType" value="barrel">Barrel</option>
                                </select>
                            </div>
                            <button className="ui button" type="submit">Submit</button>
                        </form>
                    </div>
                    <div className={"example"} style={{paddingInline: "2%", paddingTop: "2%"}}>
                        {this.state.showExample ?
                            <Tank tankData={{
                                name: this.state.name,
                                tankType: this.state.tankType
                            }} detailButtonVisible={false}/>
                            : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateTank;

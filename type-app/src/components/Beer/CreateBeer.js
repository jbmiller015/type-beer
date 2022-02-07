import React from 'react';
import typeApi from '../../api/type-server'
import NavComponent from "../NavComponent";
import Beer from "./Beer";


class CreateBeer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            style: "",
            desc: ""
        }
    }

    onFormSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name: this.state.name,
            style: this.state.style,
            desc: this.state.desc
        }


        await typeApi.post('/beer', formData)
            .then(res =>
                this.props.history.push('/fridge'))
            .catch(err => {
                console.error(err)
            });
    }


    handleChange = e => {
        const {name, files, value} = e.target;
        if (name === "image") {
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.addEventListener("load", () => {
                this.setState({
                    [name]: reader.result
                })
            })
        } else {
            this.setState({
                [name]: value
            })
        }
    };

    render() {
        return (
            <div>
                <NavComponent tanks={false}/>
                <div className="ui horizontal divider"/>
                <div className="container"
                     style={{display: "flex", flexWrap: "wrap", flexDirection: "row", justifyContent: "center"}}>
                    <div className="form" style={{padding: "2%"}}>
                        <form className="ui form" onSubmit={this.onFormSubmit}>
                            <div className="field">
                                <label>Name:</label>
                                <input type="text" name="name" placeholder={this.props.name ? this.props.name : ""}
                                       onChange={this.handleChange}/>
                            </div>
                            <div className="field">
                                <label>Style:</label>
                                <input type="text" name="style" placeholder={this.props.style ? this.props.style : ""}
                                       onChange={this.handleChange}/>
                            </div>

                            <div className="field">
                                <label>Description:</label>
                                <textarea name="desc" placeholder={this.props.desc ? this.props.desc : ""}
                                          onChange={this.handleChange}/>
                            </div>
                            <button className="ui button" type="submit">Submit</button>
                        </form>
                    </div>
                    <div className={"example"} style={{paddingInline: "2%", paddingTop: "2%"}}>
                        {this.state.name.length > 0 || this.state.style.length > 0 ?
                            <Beer beerData={{name: this.state.name, style: this.state.style, image: this.state.image}}
                                  detailButtonVisible={false}/>
                            : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}


export default CreateBeer;

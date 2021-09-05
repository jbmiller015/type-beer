import React from 'react';
import Tank from "./Tank";
import NavComponent from "../NavComponent";
import typeApi from "../../api/type-server";


class BrewFloor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            tanks: [],
            beers: []
        };
    }

    componentDidMount() {
        typeApi.get('/tank').then(response => {
            this.setState({
                tanks: response.data,
            });
        }, error => {
            this.setState({
                isLoaded: true,
                error
            })
        });
        typeApi.get('/beer').then(response => {
            this.setState({
                isLoaded: true,
                beers: response.data,
            });
        }, error => {
            this.setState({
                isLoaded: true,
                error
            })
        });
    }


    render() {
        const {error, isLoaded, tanks} = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return (

                <div className="ui active centered inline inverted dimmer">
                    <div className="ui big text loader">Loading</div>

                </div>
            );
        } else {

            let tankComponents = tanks.map((tank, i) => {
                return (<Tank tankData={tank} key={i}/>)
            })

            return (
                <div>
                    <NavComponent/>
                    <div className={"ui equal width stackable grid"}
                         style={{paddingInline: "5%"}}>
                        {tankComponents}
                    </div>
                </div>
            )
        }
    }
}

export default BrewFloor;

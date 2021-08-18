import React from 'react';
import Tank from "./Tank";
import typeApi from "../../api/type-server";
import { useHistory } from 'react-router-dom';


class BrewFloor extends React.Component {

    constructor() {
        super();
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

        const history = useHistory();

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {

            let tankComponents = tanks.map((tank, i) => {
                return (<Tank tankData={tank} key={i}/>)
            })

            return (
                <div>
                    <button onClick={() => history.push('/createtank')}>
                        Click me
                    </button>
                    <div>{tankComponents}</div>
                </div>
            )
        }
    }
}

export default BrewFloor;

import React from 'react';
import Tank from "./Tank";
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
            return <div>Loading...</div>;
        } else {

            let tankComponents = tanks.map((tank, i) => {
                return (<Tank tankData={tank} key={i}/>)
            })

            return (
                <div>
                    <div className={"ui menu"}>
                        <div className={"header item"}>
                            <div className={"ui animated button"} tabIndex="0"
                                 onClick={() => this.props.history.push('/create/tank')}>
                                <div className={"visible content"}>Create Tank</div>
                                <div className={"hidden content"}>
                                    <i className={"right arrow icon"}></i>
                                </div>
                            </div>
                        </div>
                        <div className={"header item"}>
                            <div className={"ui animated button"} tabIndex="0"
                                 onClick={() => this.props.history.push('/create/beer')}>
                                <div className={"visible content"}>Create Beer</div>
                                <div className={"hidden content"}>
                                    <i className={"right arrow icon"}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"ui four column doubling stackable grid container"}>
                        <div className={"ui link cards"}>{tankComponents}</div>
                    </div>
                </div>
            )
        }
    }
}

export default BrewFloor;

import React from "react";
import typeApi from "../../api/type-server";
import Tank from "../BrewFloor/Tank";
import Message from "../Messages/Message";
import NavComponent from "../NavComponent";
import Beer from "./Beer";

class Fridge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: [],
            isLoaded: true,
            infoMessage: null,
            beers: {},
            show: false,
            modalData: null,
        };
        this.setState({isLoaded: true});
    }

    async componentDidMount() {
        await typeApi.get('/beer').then(response => {
            response.data.map(el => {
                this.setState(prevState => ({
                    beers: {
                        ...prevState.beers,
                        [el._id]: el
                    }
                }))
            })
        }, err => {
            this.setState(state => ({
                isLoaded: true,
                error: [...state.error, err.message]
            }))
        });
    }


    editBeer = async (beerId, data) => {
        for (let el in this.state.tanks) {
            if (this.state.tanks[el].contents === beerId) {
                let tank = this.state.tanks[el];
                tank.contents = data._id;
                await this.editTank(tank._id, tank);
                break;
            }
        }

        await typeApi.put(`/beer/${beerId}`, data).then((res) => {
            let newState = {...this.state};
            newState.beers[beerId] = res.data;
            this.setState(newState);
        }).catch(err => {
            this.setState(state => ({
                error: [...state.error, err.message]
            }))
        })
    }

    deleteBeer = async (beerId) => {
        for (let el in this.state.tanks) {
            if (this.state.beers[this.state.tanks[el].contents]) {
                this.setState(state => ({
                    error: [...state.error, `Cannot Delete Beer. This beer is currently in the tank, ${el.name}. Remove the beer from the tank before removing the beer from your fridge.`]
                }))
            }
        }

        if (this.state.error.length === 0) {
            await typeApi.delete(`/beer/${beerId}`).then((res) => {
                let newState = {...this.state};
                delete newState.beers[beerId];
                this.setState(newState);
                this.setState({infoMessage: "Deleted Beer:" + beerId})
            }).catch(err => {
                this.setState(state => ({
                    error: [...state.error, err.message]
                }))
            })
        }
    }

    render() {
        const {beers, isLoaded, error} = this.state;

        let errMessage = error.map((err, i) => {
            return (
                <Message key={i} messageType={'error'} onClose={() => this.setState({error: []})} message={err}/>
            )
        })

        if (!isLoaded) {
            return (
                <div className="ui active centered inline inverted dimmer">
                    <div className="ui big text loader">Loading</div>
                </div>
            );
        } else {
            let components = Object.keys(beers).map((beer, i) => {
                return (
                    <Beer beerData={beers[beer]} key={i} loadData={this.loadBeerData} detailButtonVisible={true}/>)
            })

            return (

                <div>
                    <NavComponent tanks={true} toggleActive={(state) => {
                        this.setState({tanksActive: state})
                    }}/>
                    <div className="ui horizontal divider"/>
                    {error.length > 0 ? errMessage : null}
                    {this.state.infoMessage ? <Message messageType={'info'} message={this.state.infoMessage}
                                                       onClose={() => this.setState({infoMessage: null})}/> : null}

                    {components}
                </div>
            );
        }
    }
}

export default Fridge;

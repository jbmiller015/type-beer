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
            styles: [],
            show: false,
            modalData: null,
            term: ''
        };
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
            this.setState({isLoaded: true})
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

    filterEntries = (query, filter = null) => {
        let [key, queryString] = query.split(' ', 2)
        if (query.charAt(0) === ':' && !this.state.infoMessage) {
            console.log(': detected')
            this.setState({infoMessage: "Use ':<type> <value>' to search based on filter type. Example: ':name saftig' or ':style ipa'"})
        }
        if (query.charAt(0) === ':' && queryString) {
            key = key.substring(1);
            console.log();

            const matcher = new RegExp(queryString, 'ig');
            let result;
            try {
                result = Object.values(this.state.beers).filter((beer) => {
                    console.log(beer)
                    return beer[key].match(matcher)
                })
            } catch (err) {
                if (err instanceof TypeError) {
                    this.setState(state => ({
                        error: [...state.error, `Unrecognized Type '${key}'`]
                    }))
                } else {
                    this.setState(state => ({
                        error: [...state.error, err.message]
                    }))
                }
            }

            return result

        } else {
            const matcher = new RegExp(query, 'ig')
            const result = Object.values(this.state.beers).filter((beer) => {
                return beer.name.match(matcher)
            })
            return result
        }

    }

    sortEntries = (key, direction) => {
        const sorted = Object.values(this.state.beers).sort((a, b) => {
            return (a[key] > b[key] ? 1 : ((b[key] > a[key]) ? -1 : 0))
        })

        console.log(sorted)

        return direction === 'desc' ? sorted : sorted.reverse();
    }

    filterButtons = () => {
        return (<div style={{paddingInline: "1%"}}>
            <div className={"ui centered grid"}
                 style={{paddingTop: "1%", paddingBottom: "2%"}}>
                <div style={{textAlign: "center"}} className={"ui icon input"}>
                    <input value={this.state.term} onChange={e => this.setState({term: e.target.value})}
                           className="input"/>
                    <i className={"search icon"} style={{marginRight: "5%"}}/>
                </div>
                <div style={{textAlign: "center"}} className={"ui simple icon dropdown button"}>
                    <i className={"filter icon"}/>
                    <i className="dropdown icon"/>
                    <div className={"menu"}>
                        <div className={"item"} onClick={() => {
                            this.setState({sorted: ['name', 'desc']})
                        }}>
                            <i className={"sort alphabet down icon"}/>
                            <label>Name</label>
                        </div>
                        <div className={"item"} onClick={() => {
                            this.setState({sorted: ['name', 'asc']})
                        }}>
                            <i className={"sort alphabet up icon"}/>
                            <label>Name</label>
                        </div>
                        <div className={"item"} onClick={() => {
                            this.setState({sorted: ['style', 'desc']})
                        }}>
                            <i className={"sort alphabet down icon"}/>
                            <label>Style</label>
                        </div>
                        <div className={"item"} onClick={() => {
                            this.setState({sorted: ['style', 'asc']})
                        }}>
                            <i className={"sort alphabet up icon"}/>
                            <label>Style</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }

    render() {
        const {beers, isLoaded, error} = this.state;

        let errMessage = error.map((err, i) => {
            return (
                <Message key={i} messageType={'error'} onClose={() => this.setState({error: [], term: ''})}
                         message={err}/>
            )
        })

        if (!isLoaded) {
            return (
                <div className="ui active centered inline inverted dimmer">
                    <div className="ui big text loader">Loading</div>
                </div>
            );
        } else {
            let components;
            if (this.state.term.length > 0 && error.length < 1) {
                try {
                    components = this.filterEntries(this.state.term).map((beer, i) => {
                        return (
                            <Beer beerData={beer} key={i} loadData={this.loadBeerData} detailButtonVisible={true}/>)
                    })
                } catch (err) {
                    return null;
                }
            } else if (this.state.sorted && error.length < 1) {
                components = this.sortEntries(this.state.sorted[0], this.state.sorted[1]).map((beer, i) => {
                    return (
                        <Beer beerData={beer} key={i} loadData={this.loadBeerData} detailButtonVisible={true}/>)
                })
            } else if (error.length < 1) {
                components = Object.keys(beers).map((beer, i) => {
                    return (
                        <Beer beerData={beers[beer]} key={i} loadData={this.loadBeerData} detailButtonVisible={true}/>)
                })
            }

            return (

                <div>
                    <NavComponent tanks={true} toggleActive={(state) => {
                        this.setState({tanksActive: state})
                    }}/>
                    <div className="ui horizontal divider"/>
                    {error.length > 0 ? errMessage : null}
                    {this.state.infoMessage ? <Message messageType={'info'} message={this.state.infoMessage}
                                                       onClose={() => this.setState({infoMessage: null})}/> : null}
                    {this.filterButtons()}
                    <div className={"ui padded equal height equal width centered stackable grid"}
                         style={{paddingInline: "5%"}}>
                        {components}
                    </div>
                </div>
            );
        }
    }

}

export default Fridge;

import React from 'react';
import Tank from "./Tank";
import NavComponent from "../NavComponent";
import typeApi from "../../api/type-server";
import Modal from "../modal/Modal";
import modal from "../modal/Modal.css"
import Beer from "../Beer/Beer";


class BrewFloor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: [],
            isLoaded: false,
            infoMessage: null,
            tanks: {},
            beers: {},
            processes: {},
            show: false,
            modalData: null,
            tanksActive: this.props.tanks
        };
        this.showModal = this.showModal.bind(this);
    }

    async componentDidMount() {
        await typeApi.get('/tank').then(response => {
            response.data.map(el => {
                this.setState(prevState => ({
                    tanks: {
                        ...prevState.tanks,
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
        await typeApi.get('/beer').then(response => {
            response.data.map(el => {
                this.setState(prevState => ({
                    beers: {
                        ...prevState.beers,
                        [el._id]: el
                    },
                    isLoaded: true,
                }))
            })
        }, err => {
            this.setState(state => ({
                isLoaded: true,
                error: [...state.error, err.message]
            }))
        });
        await typeApi.get('/process').then(response => {
            response.data.map(el => {
                this.setState(prevState => ({
                    processes: {
                        ...prevState.processes,
                        [el._id]: el
                    },
                    isLoaded: true,
                }))
            })
        }, err => {
            this.setState(state => ({
                isLoaded: true,
                error: [...state.error, err.message]
            }))
        });
    }

    deleteTank = (tankId) => {
        typeApi.delete(`/tank/${tankId}`).then((res) => {
            let newState = {...this.state};
            delete newState.tanks[tankId];
            this.setState(newState);
            this.setState({infoMessage: "Deleted Tank:" + tankId})
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


    editTank = async (tankId, data) => {
        await typeApi.put(`/tank/${tankId}`, data).then((res) => {
            let newState = {...this.state};
            newState.tanks[tankId] = res.data;
            this.setState(newState);
        }).catch(err => {
            this.setState(state => ({
                error: [...state.error, err.message]
            }))
        })
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


    loadTankData = (modalData) => {
        const beer = this.state.beers[modalData.contents]
        modalData.contents = beer;
        this.setState({
            modalData
        });
        this.setState({
            show: true,
        });
    };

    loadBeerData = (modalData) => {
        this.setState({
            modalData
        });
        this.setState({
            show: true,
        });
    };

    /**
     * Sets modal visibility.
     */
    showModal = () => {
        if (this.state.modalData) {
            this.setState({
                show: false,
                modalData: null
            });
        } else {
            this.setState({
                show: true,
            });
        }
    };


    render() {

        const {error, isLoaded, tanks, beers, modalData} = this.state;

        let errMessage = error.map((err, i) => {
            return (
                <div key={i} className={"ui error message"}>
                    <i className="close icon" onClick={() => this.setState({error: []})}/>
                    <div className={"header"}>
                        {err}
                    </div>
                </div>
            )
        })

        let infoMessage = (
            <div className={"ui info message"}>
                <i className="close icon" onClick={() => this.setState({infoMessage: null})}/>
                <div className={"header"}>
                    {this.state.infoMessage}
                </div>
            </div>
        );

        if (!isLoaded) {
            return (
                <div className="ui active centered inline inverted dimmer">
                    <div className="ui big text loader">Loading</div>
                </div>
            );
        } else {
            let components;
            this.state.tanksActive ?
                components = Object.keys(tanks).map((tank, i) => {
                    return (
                        <Tank tankData={tanks[tank]} key={i} contents={this.state.beers[tanks[tank].contents]}
                              loadData={this.loadTankData}
                              detailButtonVisible={true}/>)
                }) :
                components = Object.keys(beers).map((beer, i) => {
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
                    {this.state.infoMessage ? infoMessage : null}
                    {this.state.tanksActive ?
                        modalData ?
                            <Modal onClose={this.showModal}
                                   deleteTank={this.deleteTank}
                                   editTank={this.editTank}
                                   show={this.state.show}
                                   data={modalData}
                                   tankModal={true}/> : null
                        : modalData ?
                            <Modal onClose={this.showModal}
                                   deleteBeer={this.deleteBeer}
                                   editBeer={this.editBeer}
                                   show={this.state.show}
                                   data={modalData}
                                   tankModal={false}/> : null
                    }

                    <div className={"ui padded equal height centered stackable grid"}>
                        {components}
                    </div>
                </div>
            )
        }
    }
}

export default BrewFloor;

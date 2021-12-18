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
            tanks: [],
            beers: [],
            show: false,
            modalData: null,
            tanksActive: this.props.tanks
        };
        this.showModal = this.showModal.bind(this);
    }

    componentDidMount() {
        typeApi.get('/tank').then(response => {
            console.log('Loaded')
            this.setState({
                tanks: response.data,
            });
        }, err => {
            this.setState(state => ({
                isLoaded: true,
                error: [...state.error, err.message]
            }))
        });
        typeApi.get('/beer').then(response => {
            this.setState({
                isLoaded: true,
                beers: response.data,
            });
        }, err => {
            this.setState(state => ({
                isLoaded: true,
                error: [...state.error, err.message]
            }))
        });
    }

    deleteTank = (tankId) => {
        console.log("deleting")
        typeApi.delete(`/tank/${tankId}`).then((res) => {
            this.setState({infoMessage: "Deleted Tank:" + tankId})
        }).catch(err => {
            this.setState(state => ({
                error: [...state.error, err.message]
            }))
        })

        const tanks = this.state.tanks;

        this.setState({
            tanks: this.state.tanks.filter((_, i) => {
                return tanks[i]._id !== tankId;
            })
        });
    }

    deleteBeer = async (beerId) => {
        console.log("deleting")
        for (let el of this.state.tanks) {
            console.log("contents id", el.contents._id)
            console.log("beerId", beerId)
            if (el.contents._id === beerId) {
                this.setState(state => ({
                    error: [...state.error, `Cannot Delete Beer. This beer is currently in the tank, ${el.name}. Remove the beer from the tank before removing the beer from your fridge.`]
                }))
                break;
            }
        }

        console.log("Errors:" + this.state.error.length)
        console.log(this.state.error)

        if (this.state.error.length === 0) {
            await typeApi.delete(`/beer/${beerId}`).then((res) => {
                this.setState({infoMessage: "Deleted Beer:" + beerId})
            }).catch(err => {
                this.setState(state => ({
                    error: [...state.error, err.message]
                }))
            })

            const beers = this.state.beers;

            this.setState({
                beers: this.state.beers.filter((_, i) => {
                    return beers[i]._id !== beerId;
                })
            });
        }
    }


    editTank = async (tankId, data) => {
        let index = this.state.tanks.indexOf(data);
        if (index < 0 || this.state.tanks[index]._id !== tankId) {
            await typeApi.put(`/tank/${tankId}`, data).then((res) => {
                this.setState(prevState => ({
                    tanks: prevState.tanks.map(
                        tank => tank._id === tankId ? res.data : tank
                    )
                }))
            }).catch(err => {
                console.error(err);
            })
        }
    }

    //TODO:Edit beer should change state of associated tanks locally and in DB
    editBeer = async (beerId, data) => {
        let index = this.state.beers.indexOf(data);
        if (index < 0 || this.state.beers[index]._id !== beerId) {
            await typeApi.put(`/beer/${beerId}`, data).then((res) => {
                this.setState(prevState => ({
                    beers: prevState.beers.map(
                        beer => beer._id === beerId ? res.data : beer
                    )
                }))
            }).catch(err => {
                console.error(err);
            })
        }
    }

    loadData = (modalData) => {
        this.setState({
            modalData
        });
        this.showModal();
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
                components = tanks.map((tank, i) => {
                    return (<Tank tankData={tank} key={i} loadData={this.loadData}/>)
                }) :
                components = beers.map((beer, i) => {
                    return (<Beer beerData={beer} key={i} loadData={this.loadData}/>)
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

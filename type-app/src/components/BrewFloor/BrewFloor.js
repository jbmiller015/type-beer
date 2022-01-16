import React from 'react';
import Tank from "./Tank";
import NavComponent from "../NavComponent";
import typeApi from "../../api/type-server";
import Modal from "../modal/Modal";
import modal from "../modal/Modal.css"
import Beer from "../Beer/Beer";
import Message from "../Messages/Message";

//TODO:Break off beers to new component
//TODO:Get list of active beers from server by ids
class BrewFloor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: [],
            isLoaded: false,
            infoMessage: null,
            tanks: {},
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
            let components = Object.keys(tanks).map((tank, i) => {
                return (
                    <Tank tankData={tanks[tank]} key={i} contents={this.state.beers[tanks[tank].contents]}
                          loadData={this.loadTankData}
                          detailButtonVisible={true}/>)
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

                    <Modal onClose={this.showModal}
                           deleteTank={this.deleteTank}
                           editTank={this.editTank}
                           show={this.state.show}
                           data={modalData}
                           tankModal={true}/>


                    <div className={"ui padded equal height centered stackable grid"}>
                        {components}
                    </div>
                </div>
            )
        }
    }
}

export default BrewFloor;

import React from 'react';
import Tank from "./Tank";
import NavComponent from "../NavComponent";
import typeApi from "../../api/type-server";
import Modal from "../modal/Modal";
import modal from "../modal/Modal.css"
import Message from "../Messages/Message";
import GoToCreate from "../Buttons/GoToCreate";

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
            tanksActive: this.props.tanks,
            beers: {}
        };
        this.showModal = this.showModal.bind(this);
    }

    async componentDidMount() {
        console.log(localStorage.getItem('token'))
        let tank;
        let process;
        if (localStorage.getItem('token').includes("demoToken")) {
            console.log("demotoken")
            tank = "/demo/tank";
            process = "/demo/process"
        } else {
            tank = "/tank";
            process = "/process/active"
        }
        console.log(tank)
        await typeApi.get(tank).then(response => {
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
        await typeApi.get(process).then(response => {
            response.data.map(el => {
                this.setState(prevState => ({
                    processes: {
                        ...prevState.processes,
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

    getBeerById = async (beerId) => {
        const beerUrl = localStorage.getItem('token').includes("demoToken") ? "demo/beer/" : "beer/";
        const beer = this.state.beers[beerId] || await typeApi.get(`${beerUrl}${beerId}`).then((res) => {
            return res.data[0];
        }).catch(err => {
            this.setState(state => ({
                error: [...state.error, err.message]
            }))
        })
        if (!this.state.beers[beerId]) {
            this.setState(state => ({
                beers: {...state.beers, [beerId]: beer}
            }))
        }
        return beer;
    }

    deleteTank = (tankId) => {
        typeApi.delete(`/tank/${tankId}`).then((res) => {
            let newState = {...this.state};
            delete newState.tanks[tankId];
            this.setState(newState);
            this.setState({infoMessage: "Deleted Tank:" + tankId})
        }).catch(err => {
            this.setState(state => ({
                error: [...state.error, err.response.data]
            }))
        })
    }


    editTank = async (tankId, data) => {

        let tankData = this.state.tanks[tankId];
        Object.entries(data).forEach((el) => {
            tankData[el[0]] = el[1];
        })
        console.log(tankData)
        await typeApi.put(`/tank/${tankId}`, tankData).then((res) => {
            let newState = {...this.state};
            newState.tanks[tankId] = res.data;
            this.setState(newState);
        }).catch(err => {
            this.setState(state => ({
                error: [...state.error, err.message]
            }))
        })
    }


    loadTankData = (tankData, process = null) => {
        this.setState({
            modalData: {tankData: tankData, process: process}
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

        const {error, isLoaded, tanks, processes, modalData} = this.state;

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
            let components = Object.values(tanks).map((tank, i) => {
                let process;
                for (let el in processes) {
                    if (processes[el].activePhase.startTank === tank._id) {
                        process = processes[el];
                        tank.fill = true;
                    }
                }
                return (
                    <Tank tankData={tank} process={process} key={i}
                          loadData={this.loadTankData}
                          detailButtonVisible={true}
                          getContents={async (beerId) => {
                              return this.getBeerById(beerId)
                          }}/>)
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

                    {this.state.show ? < Modal onClose={this.showModal}
                                               deleteTank={this.deleteTank}
                                               editTank={this.editTank}
                                               getBeerById={this.getBeerById}
                                               show={this.state.show}
                                               data={modalData}
                                               tankModal={true}/> : null}


                    {this.state.tanks ?
                        <div className={"ui padded equal height centered stackable grid"}>
                            {components}
                        </div> : <div style={{marginTop: "5%"}}><GoToCreate destination={"tank"}/></div>
                    }
                </div>
            )
        }
    }
}

export default BrewFloor;

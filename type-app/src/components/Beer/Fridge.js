import React from "react";
import typeApi from "../../api/type-server";
import Tank from "../BrewFloor/Tank";
import Message from "../Messages/Message";
import NavComponent from "../NavComponent";
import Beer from "./Beer";
import Modal from "../modal/Modal";
import {filterSort} from "../Process/ProcessFunctions";
import Shrugger from "../Messages/Shrugger";
import SearchFilter from "../Fields/SearchFilter";

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

        let beerData = this.state.beers[beerId];
        Object.entries(data).forEach((el) => {
            beerData[el[0]] = el[1];
        })
        await typeApi.put(`/beer/${beerId}`, beerData).then(async (res) => {
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

        if (this.state.error.length === 0) {
            await typeApi.delete(`/beer/${beerId}`).then((res) => {
                let newState = {...this.state};
                delete newState.beers[beerId];
                this.setState(newState);
                this.setState({infoMessage: "Deleted Beer:" + beerId})
            }).catch(err => {
                this.setState(state => ({
                    error: [...state.error, err.response.data]
                }))
            })
        }
    }

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

    setInfoMessage = (message) => {
        this.setState({infoMessage: message.infoMessage})
    }

    setErrorMessage = (message) => {
        this.setState(state => ({
            error: [...state.error, message.errorMessage]
        }))
    }

    renderComponents = () => {
        let components = Object.values(this.state.beers);

        components = filterSort(components, this.state.term, this.state.sorted, this.setErrorMessage)

        if (components.length > 0) {
            components = components.map((beer, i) => {
                return (
                    <Beer beerData={beer} key={i} loadData={this.loadBeerData} detailButtonVisible={true}/>)
            })
        } else components = (<div>
            <div className="ui horizontal divider"/>
            <Shrugger message={"Couldn't find anything"}/>
        </div>)
        return components
    }

    render() {
        const {isLoaded, error} = this.state;

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
            return (
                <div>
                    <NavComponent tanks={true} toggleActive={(state) => {
                        this.setState({tanksActive: state})
                    }}/>
                    {error.length > 0 ? errMessage : null}
                    {this.state.infoMessage ? <Message messageType={'info'} message={this.state.infoMessage}
                                                       onClose={() => this.setState({infoMessage: null})}/> :
                        <div style={{marginTop: "3.55%"}} className="ui horizontal divider"/>}
                    <div className="ui horizontal divider"/>
                    <SearchFilter page={"fridge"}
                                  setMessage={(message) => this.setInfoMessage(message)}
                                  handleChange={e => this.setState({term: e.target.value})} term={this.state.term}
                                  setSorted={sorted => this.setState({sorted: sorted.sorted})}
                                  reset={() => {
                                      this.setState({term: '', sorted: null, error: []})
                                  }}/>
                    {this.state.show ? <Modal onClose={this.showModal}
                                              deleteBeer={this.deleteBeer}
                                              editBeer={this.editBeer}
                                              getBeerById={this.getBeerById}
                                              show={this.state.show}
                                              data={this.state.modalData}
                                              tankModal={false}/> : null}
                    <div className={"ui padded equal height equal width centered stackable grid"}>
                        {this.state.error.length < 1 ? this.renderComponents() :
                            <Shrugger message={"Something went wrong.\nCheck the error message before continuing."}/>}
                    </div>
                </div>
            );
        }
    }

}

export default Fridge;

import React from 'react';
import Tank from "./Tank";
import NavComponent from "../NavComponent";
import typeApi from "../../api/type-server";
import Modal from "../modal/Modal";
import modal from "../modal/Modal.css"


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
            modalData: null
        };
        this.showModal = this.showModal.bind(this);
    }

    componentDidMount() {
        typeApi.get('/tank', {headers: {'Authorization': sessionStorage.getItem('token')}}).then(response => {
            this.setState({
                tanks: response.data,
            });
        }, err => {
            this.setState(state => ({
                isLoaded: true,
                error: [...state.error, err.message]
            }))
        });
        typeApi.get('/beer', {headers: {'Authorization': sessionStorage.getItem('token')}}).then(response => {
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

    editTank = (tankId, data) => {
        typeApi.put(`/tank/${tankId}`, data).then((res) => {
            this.setState(prevState => ({
                tanks: prevState.tanks.map(
                    tank => tank._id === tankId ? res.data : tank
                )
            }))
        }).catch(err => {
            console.error(err);
        })
    }

    /**
     * Receives square data for modal.
     * @param squareData
     */
    loadData = (tankData) => {

        this.setState({
            modalData: tankData
        });
        this.showModal();
    };

    /**
     * Sets modal visibility.
     */
    showModal = () => {
        this.setState({
            show: !this.state.show,
        });
    };


    render() {

        const {error, isLoaded, tanks, modalData} = this.state;

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
            let tankComponents = tanks.map((tank, i) => {
                return (<Tank tankData={tank} key={i} loadData={this.loadData}/>)
            })
            return (
                <div>
                    <NavComponent/>
                    <div className="ui horizontal divider"/>
                    {error.length > 0 ? errMessage : null}
                    {this.state.infoMessage ? infoMessage : null}
                    {modalData ?
                        <Modal onClose={this.showModal}
                               deleteTank={this.deleteTank}
                               editTank={this.editTank}
                               show={this.state.show}
                               data={modalData}
                               tankModal={true}/> : null
                    }
                    <div className={"ui padded equal height centered stackable grid"}>
                        {tankComponents}
                    </div>
                </div>
            )
        }
    }
}

export default BrewFloor;

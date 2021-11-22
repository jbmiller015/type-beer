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
            error: null,
            isLoaded: false,
            tanks: [],
            beers: [],
            show: false,
            modalData: null
        };
        this.showModal = this.showModal.bind(this);
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

    deleteTank = (tankId) => {
        typeApi.delete(`/tank/${tankId}`).then((res) => {
        }).catch(err => {
            console.error(err);
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

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
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
                    {modalData ?
                        <Modal onClose={this.showModal}
                               deleteTank={this.deleteTank}
                               editTank={this.editTank}
                               show={this.state.show}
                               data={modalData}/> : null
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

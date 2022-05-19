import React, {useCallback, useEffect, useState} from 'react';
import EditTank from "./EditTank";
import TankContent from "./TankContent";
import BeerContent from "./BeerContent";
import EditBeer from "./EditBeer";
import useComponentVisible from "../Hooks/useComponentVisible";
import useWindowDimensions from "../Hooks/useWindowDimensions";

const Modal = (props) => {

    const [edit, setEdit] = useState(false)
    const [verify, setVerify] = useState(false)
    const [data, setData] = useState()
    const [editData, setEditData] = useState({})

    const {ref, isComponentVisible, setIsComponentVisible} = useComponentVisible(true);
    const dem = useWindowDimensions();
    const [mobileView, setMobileView] = useState();
    useEffect(() => {
        setMobileView(dem.width < 415);
    }, [dem]);

    const escFunction = useCallback((event) => {

        if (event.key === "Escape") {
            onClose()
        }
    }, []);

    useEffect(() => {
        if (props.data !== null) {
            setData(props.data)
            setIsComponentVisible(true)
        }
    }, [props.data])

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);

    const onClose = event => {
        setData(null)
        props.onClose(event);
    };

    const handleEditChange = e => {
        let {name, value, checked} = e.target;
        if (name === "fill") {
            value = checked
        }
        setEditData({...editData, [name]: value});
    };


    const buttons = () => {
        if (edit) {
            return (
                <div className="actions">
                    <button className="ui grey button" onClick={() => {
                        setEditData(null)
                        setEdit(false)
                    }}>
                        Cancel
                    </button>
                    <button className="ui right floated green button"
                            onClick={async (e) => {
                                props.tankModal ? await props.editTank(props.data.tankData._id, editData) : await props.editBeer(props.data._id, editData);
                                setEdit(false)
                                onClose(e);
                            }}>
                        Submit
                    </button>
                </div>
            )
        } else if (verify) {
            return (
                <div className="actions"><h4>Are You Sure?</h4>
                    <button className="ui red button" onClick={async (e) => {
                        props.tankModal ? await props.deleteTank(props.data.tankData._id) : await props.deleteBeer(props.data._id);
                        setVerify(false)
                        onClose(e);
                    }}>
                        Delete
                    </button>
                    <button className="ui grey button" onClick={(e) => {
                        setVerify(false)
                    }}>
                        Cancel
                    </button>
                </div>
            )
        } else {
            return (
                <div className="actions">
                    <button className="ui grey button" onClick={onClose}>
                        Close
                    </button>
                    <button className="ui grey button"
                            onClick={() => {
                                setEditData(data)
                                setEdit(true)
                            }}>
                        Edit
                    </button>
                    <button className="ui right floated red button" onClick={() =>
                        setVerify(true)}>
                        Delete
                    </button>
                </div>
            )
        }
    }
    const content = () => {
        return props.tankModal ?
            <TankContent data={props.data} getBeerById={async (beerId) => await props.getBeerById(beerId)}/> :
            <BeerContent data={props.data}/>;
    };

    const editContent = () => {
        return (<div className="content">
                {props.tankModal ?
                    <EditTank passed={props.data} handleChange={handleEditChange}/> :
                    <EditBeer passed={props.data} handleChange={handleEditChange}/>}
            </div>
        )
    };

    const modalStyle = () => {
        if (props.tankModal && mobileView) {
            return {height: "65%", width: "90%", scrollbars: "none"}
        }
        if (!props.tankModal && mobileView) {
            return {maxHeight: "51%", width: "90%", scrollbars: "none"}
        } else
            return {height: "auto", width: "30%"}
    }
    return (props.show && data && isComponentVisible ?
        <div style={modalStyle()} className="modal" id="modal" ref={ref}>
            <h2>{data.tankData ? data.tankData.name : data.name} < /h2>
            {edit ? editContent() : content()}
            {buttons()}
        </div> : null);


}

export default Modal;

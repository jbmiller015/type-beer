import React, {useState} from 'react';
import tankOverlay from '../../media/tankwwindow.png';
import moment from "moment";

//Should adjust look if filled
const Tank = (props) => {

    const [edit, setEdit] = useState(false);

    const {currPhase, currPhaseDate, contents, fill, _id} = props.tankData;

    /*const dateFormat = (date) => {
        let datetime = new Date(date);
        let result = datetime.getMonth();
        result += "/" + datetime.getDay();
        result += "/" + datetime.getFullYear();
        return result;
    };*/

    const remainingTime = (phaseDate) => {
        const nextMoment = moment(phaseDate);
        return nextMoment.toNow();
    }

    const imageWrapper = {
        backgroundColor: (contents && !contents.image && fill) ? '#DAA520' : '',
        backgroundImage: `url(${contents ? contents.image : ''})`,
        backgroundSize: '70% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    }


    return (
        <div className={"center aligned column"}>
            <div className={"ui cards"}>
                <div className={"card"}>
                    <div className={"image"} style={imageWrapper}>
                        <img alt="tankOverlay" src={tankOverlay}/>
                    </div>
                    <div className={"content"}>
                        <div className={"header"}>{contents && contents.name ? contents.name : ""}</div>
                        <div className={"meta"}>{remainingTime(currPhaseDate) ? remainingTime(currPhaseDate) : ""}</div>
                    </div>
                    <div className={"extra content"}>
                        <span>{currPhase ? currPhase : ""}</span>
                    </div>
                    <div className="extra content">{!edit ?
                        <div className="ui two buttons">
                            <button className="ui basic green button">Details</button>
                            <button className="ui basic grey button" onClick={() => setEdit(true)}>Edit
                            </button>
                        </div> :
                        <div className="ui three buttons">
                            <button className="ui basic yellow button">Edit Details</button>
                            <button className="ui basic red button" onClick={() => props.deleteTank(_id)}>Delete
                            </button>
                            <button className="ui basic grey button" onClick={() => setEdit(false)}>Cancel
                            </button>
                        </div>
                    }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tank;


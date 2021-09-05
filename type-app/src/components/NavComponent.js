import React from 'react';
import {useHistory} from "react-router-dom";

const NavComponent = (props) => {
    let history = useHistory();
    return (
        <div className={"ui menu"}>
            <div className={"header item"}>
                <div className={"ui animated button"} tabIndex="0"
                     onClick={() => history.push('/create/tank')}>
                    <div className={"visible content"}>Create Tank</div>
                    <div className={"hidden content"}>
                        <i className={"right arrow icon"}></i>
                    </div>
                </div>
            </div>
            <div className={"header item"}>
                <div className={"ui animated button"} tabIndex="0"
                     onClick={() => history.push('/create/beer')}>
                    <div className={"visible content"}>Create Beer</div>
                    <div className={"hidden content"}>
                        <i className={"right arrow icon"}></i>
                    </div>
                </div>
            </div>
            <div className={"header item"}>
                <div className={"ui animated button"} tabIndex="0"
                     onClick={() => history.push('/')}>
                    <div className={"visible content"}>Brew Floor</div>
                    <div className={"hidden content"}>
                        <i className={"right arrow icon"}></i>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default NavComponent;

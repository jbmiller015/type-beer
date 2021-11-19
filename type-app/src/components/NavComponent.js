import React from 'react';
import {useHistory} from "react-router-dom";

const NavComponent = (props) => {
    let history = useHistory();


    return (
        <div style={{paddingInline: "1%"}}>
            <div className={"ui borderless fluid three item menu"}>
                <div className={"item"}>
                    <div className={"fluid ui basic animated button"} tabIndex="0"
                         onClick={() => history.push('/')}>
                        <div className={"visible content"}>Brew Floor</div>
                        <div className={"hidden content"}>
                            <i className={"right arrow icon"}/>
                        </div>
                    </div>
                </div>
                <div className={"item"}>
                    <div className={"fluid ui basic animated button"} tabIndex="0"
                         onClick={() => history.push('/create/tank')}>
                        <div className={"visible content"}>Create Tank</div>
                        <div className={"hidden content"}>
                            <i className={"right arrow icon"}/>
                        </div>
                    </div>
                </div>
                <div className={"item"}>
                    <div className={"fluid ui basic animated button"} tabIndex="0"
                         onClick={() => history.push('/create/beer')}>
                        <div className={"visible content"}>Create Beer</div>
                        <div className={"hidden content"}>
                            <i className={"right arrow icon"}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default NavComponent;

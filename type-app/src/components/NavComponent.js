import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";

import useToken from "./Hooks/useToken";
import useWindowDimensions from "./Hooks/useWindowDimensions";

const NavComponent = (props) => {


    const {token, setToken} = useToken();
    const history = useHistory();
    const dem = useWindowDimensions();
    const [mobileView, setMobileView] = useState();
    useEffect(() => {
        setMobileView(dem.width < 415);
    }, [dem]);


    return (

        <div style={{marginTop: "-15px"}}>
            <div className={mobileView ? "ui borderless four item compact menu" : "ui borderless fluid four item menu"}
                 style={{
                     paddingInline: "5%",
                     paddingTop: "0",
                     position: "fixed",
                     zIndex: 1000,
                     maxWidth: dem.width + "px"
                 }}>
                <div className={"item"}>
                    {!mobileView ?
                        <div className={"fluid ui basic animated fade button"} tabIndex="0"
                             onClick={() => history.push('/')}>
                            <div className={"visible content"}>Brew Floor</div>
                            <div className={"hidden content"}>
                                <i className={"warehouse icon"}/>
                            </div>
                        </div> :
                        <button className="ui fluid basic icon button" onClick={() => history.push('/')}><i
                            className="warehouse icon"/></button>
                    }
                </div>
                <div className={"item"}>
                    {!mobileView ?
                        <div className={"fluid ui basic animated fade button"} tabIndex="0"
                             onClick={() => history.push('/calendar')}>
                            <div className={"visible content"}>Calendar</div>
                            <div className={"hidden content"}>
                                <i className={"calendar icon"}/>
                            </div>
                        </div> :
                        <button className="ui fluid basic icon button" onClick={() => history.push('/calendar')}><i
                            className="calendar icon"/></button>}
                </div>
                <div className={"item"}>
                    <div style={{textAlign: "center"}}
                         className={mobileView ? "ui fluid simple basic icon dropdown button" : "fluid ui basic simple dropdown button"}>
                        {mobileView ? <i className="plus icon"/> : <span className={"text"}>More</span>}
                        <i className="dropdown icon"/>
                        <div className={"menu"}>
                            <div className={"item"}>
                                <div className={"fluid ui basic animated fade button"} tabIndex="0"
                                     onClick={() => history.push('/fridge')}>
                                    <div className={"visible content"}>Beers</div>
                                    <div className={"hidden content"}>
                                        <i className={"beer icon"}/>
                                    </div>
                                </div>
                            </div>
                            <div className={"item"}>
                                <div className={"fluid ui basic animated fade button"} tabIndex="0"
                                     onClick={() => history.push('/processes')}>
                                    <div className={"visible content"}>Processes</div>
                                    <div className={"hidden content"}>
                                        <i className={"clipboard icon"}/>
                                    </div>
                                </div>
                            </div>
                            <div className={"item"}>
                                <div style={{textAlign: "center"}} className={"fluid ui basic simple dropdown button"}>
                                    <span className={"text"}>Create</span>
                                    <i className="dropdown icon"/>
                                    <div className={"left menu"}>
                                        <div className={"item"}>
                                            <div className={"fluid ui basic animated fade button"} tabIndex="0"
                                                 onClick={() => history.push('/create/tank')}>
                                                <div className={"visible content"}>Create Tank</div>
                                                <div className={"hidden content"}>
                                                    <i className={"plus icon"}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"item"}>
                                            <div className={"fluid ui basic animated fade button"} tabIndex="1"
                                                 onClick={() => history.push('/create/beer')}>
                                                <div className={"visible content"}>Create Beer</div>
                                                <div className={"hidden content"}>
                                                    <i className={"plus icon"}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"item"}>
                                            <div className={"fluid ui basic animated fade button"} tabIndex="2"
                                                 onClick={() => history.push('/create/process')}>
                                                <div className={"visible content"}>Create Process</div>
                                                <div className={"hidden content"}>
                                                    <i className={"plus icon"}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className={"item"}>
                    <div style={{textAlign: "center"}}
                         className={mobileView ? "ui fluid simple basic icon dropdown button" : "fluid ui basic simple dropdown button"}>
                        {mobileView ? <i className="user icon"/> : <span className={"text"}>Account</span>}
                        <i className="dropdown icon"/>
                        <div className={"left menu"}>
                            <div className={"item"}>
                                <div className={"item"}>
                                    <div className={"fluid ui basic animated fade button"} tabIndex="2"
                                         onClick={() => history.push('/account')}>
                                        <div className={"visible content"}>Account Info</div>
                                        <div className={"hidden content"}>
                                            <i className={"user icon"}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"item"}>
                                <div className={"fluid ui red button"} tabIndex="0"
                                     onClick={() => {
                                         localStorage.clear()
                                         setToken()
                                         window.location.reload()
                                     }}>
                                    <div className={"content"}>Log out</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"ui horizontal divider"}/>
            <div className={"ui horizontal divider"}/>
            <div className={"ui horizontal divider"}/>
        </div>
    );
}
export default NavComponent;

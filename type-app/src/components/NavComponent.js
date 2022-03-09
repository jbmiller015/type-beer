import React from 'react';
import {useHistory} from "react-router-dom";

import useToken from "../hooks/useToken";

const NavComponent = (props) => {

    const {token, setToken} = useToken();
    const history = useHistory();

    return (
        <div style={{paddingInline: "1%"}}>
            <div className={"ui borderless fluid four item menu"}>
                <div className={"item"}>
                    <div className={"fluid ui basic animated fade button"} tabIndex="0"
                         onClick={() => history.push('/')}>
                        <div className={"visible content"}>Brew Floor</div>
                        <div className={"hidden content"}>
                            <i className={"warehouse icon"}/>
                        </div>
                    </div>
                </div>
                <div className={"item"}>
                    <div className={"fluid ui basic animated fade button"} tabIndex="0"
                         onClick={() => history.push('/calendar')}>
                        <div className={"visible content"}>Calendar</div>
                        <div className={"hidden content"}>
                            <i className={"calendar icon"}/>
                        </div>
                    </div>
                </div>
                <div className={"item"}>
                    <div style={{textAlign: "center"}} className={"fluid ui basic simple dropdown button"}>
                        <span className={"text"}>More</span>
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
                    <div style={{textAlign: "center"}} className={"fluid ui basic simple dropdown button"}>
                        <span className={"text"}>Account</span>
                        <i className="dropdown icon"/>
                        <div className={"menu"}>
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
        </div>
    );
}
export default NavComponent;

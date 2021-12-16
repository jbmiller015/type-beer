import React, {useEffect, useState} from "react";
import typeApi from "../../api/type-server";
import logo from "../../media/typeBfull.png"
import useWindowDimensions from "../../hooks/useWindowDimensions";


const AuthForm = ({setToken}) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [signup, setSignup] = useState(false);
    const [path, setPath] = useState('login');
    const [error, setError] = useState({});
    const {height, width} = useWindowDimensions();


    useEffect(() => {
        signup ? setPath('signup') : setPath('login');
    }, [signup])

    const handleSubmit = async (e) => {
        e.preventDefault();

        await typeApi.post(`/${path}`, {email, password})
            .then(res => {
                setToken(res.data.token);
            })
            .catch(err => {
                console.log(err.response)
                setError(err.response);
                console.error(err);
            });
    }

    return (
        <div style={width > 770 ? {paddingInline: "30%"} : {paddingInline: "10%"}}
             className={"ui middle aligned center aligned padded grid"}>
            <div className={"column"}>
                <img alt="logo" className={"ui fluid image"} src={logo}/>
                <div className="ui horizontal divider"/>
                {
                    Object.keys(error).length !== 0 ?
                        <div className={"ui error message"}>
                            <i className="close icon" onClick={() => setError({})}/>
                            <div className={"header"}>
                                {error.status + ": " + error.statusText}
                            </div>
                            <div><p>{error.data.error}</p></div>
                        </div>
                        : null
                }
                <form className={"ui large form"}>
                    <div className={"ui stacked segment"}>
                        <div className={"field"}>
                            <div className={"ui left icon input"}>
                                <i className={"user icon"}/>
                                <input
                                    type="text"
                                    placeholder="Email Address"
                                    value={email}
                                    autoCapitalize="none"
                                    autoCorrect="false"
                                    onChange={e => {
                                        setEmail(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                        <div className={"field"}>
                            <div className={"ui left icon input"}>
                                <i className={"user icon"}/>
                                <input
                                    type="text"
                                    placeholder="Password"
                                    value={password}
                                    autoCapitalize="none"
                                    autoCorrect="false"
                                    onChange={e => {
                                        setPassword(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={"ui fluid large submit button"}
                         onClick={handleSubmit}>{path === 'login' ? "Log In" : "Sign Up"}</div>
                </form>
                <div className="ui message">
                    {path === 'login' ? "New to us? " : "Already have an account? "}
                    <a href="#" onClick={() => {
                        path === 'login' ? setSignup(true) : setSignup(false)
                    }}>
                        {path === 'login' ? "Sign Up" : "Log In"}
                    </a>
                </div>
            </div>
        </div>
    );
};


export default AuthForm;

import React, {useEffect, useState} from "react";
import typeApi from "../../api/type-server";
import logo from "../../media/typeBfull.png"
import useWindowDimensions from "../Hooks/useWindowDimensions";


const AuthForm = ({setToken}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accessKey, setAccessKey] = useState('');
    const [signup, setSignup] = useState(false);
    const [path, setPath] = useState('login');
    const [error, setError] = useState({});
    const {height, width} = useWindowDimensions();


    useEffect(() => {
        signup ? setPath('signup') : setPath('login');
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setAccessKey('')
    }, [signup])


    const validate = () => {
        if (email === '') {
            setError({status: 'Missing Field', statusText: 'Please provide email'})
            return true
        }

        if (password === '') {
            setError({status: 'Missing Field', statusText: 'Please provide password'})
            return true
        }

        if (signup && confirmPassword !== password) {
            setError({status: 'Passwords do not match', statusText: 'Please try again'})
            setConfirmPassword('')
            return true
        }

        if (signup && accessKey.length === 0) {
            setError({status: 'Missing Field', statusText: 'Please provide access key'})
            return true
        }

        return false
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitError = validate()

        if (!submitError) {
            await typeApi.post(`/${path}`, {email, password, accessKey})
                .then(res => {
                    setToken(res.data.token);
                })
                .catch(err => {
                    console.log(err.response)
                    setError(err.response);
                    console.error(err);
                });
        }
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
                            <i className="close icon" onClick={() => {
                                setError({})
                            }}/>
                            <div className={"header"}>
                                {error.status + ": " + error.statusText}
                            </div>
                            <div><p>{error.data}</p></div>
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
                                    placeholder="Email"
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
                                <i className={"key icon"}/>
                                <input
                                    type="password"
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
                        {signup ? <div className={"field"}>
                            <div className={"ui left icon input"}>
                                <i className={"key icon"}/>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    autoCapitalize="none"
                                    autoCorrect="false"
                                    onChange={e => {
                                        setConfirmPassword(e.target.value)
                                    }}
                                />
                            </div>
                        </div> : null}
                        {signup ? <div className={"field"}>
                            <div className={"ui left icon input"}>
                                <i className={"beer icon"}/>
                                <input
                                    type="string"
                                    placeholder="Beta Access Key"
                                    value={accessKey}
                                    autoCapitalize="none"
                                    autoCorrect="false"
                                    onChange={e => {
                                        setAccessKey(e.target.value)
                                    }}
                                />
                            </div>
                        </div> : null}
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

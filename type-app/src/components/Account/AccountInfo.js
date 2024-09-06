import React, {useEffect, useState} from 'react';
import logo from "../../media/typeBfull.png";
import useWindowDimensions from "../Hooks/useWindowDimensions";
import typeApi from "../../api/type-server";
import NavComponent from "../NavComponent";
import Message from "../Messages/Message";

const AccountInfo = () => {
    const [data, setData] = useState();
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [change, setChange] = useState(false);
    const [error, setError] = useState({});
    const [info, setInfo] = useState({})
    const [reset, setReset] = useState(false);
    const {width} = useWindowDimensions();

    useEffect(() => {
        const setAccountData = async () => {
            const data = await typeApi.get('/user').then((res) => {
                return res.data[0]
            }).catch(err => {
                console.log(err.response)
                setError(err.response);
            });
            setData(data)
        }
        setAccountData()

    }, [])

    const validatePass = () => {
        if (oldPassword === '') {
            setError({status: 'Missing Field', statusText: 'Please provide old password'})
            return true
        }

        if (password === '') {
            setError({status: 'Missing Field', statusText: 'Please provide new password'})
            return true
        }

        if (confirmPassword !== password) {
            setError({status: 'Passwords do not match', statusText: 'Please try again'})
            setConfirmPassword('')
            return true
        }

        return false
    }

    const validateEmail = () => {
        if (email === '') {
            setError({status: 'Missing Field', statusText: 'Please provide email'})
            return true
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError({});
        setInfo({});
        const submitError = validatePass()

        if (!submitError) {
            await typeApi.put(`/user/password`, {oldPassword, password}).then((res) => {
                setReset(false)
                setChange(false)
                setInfo({statusText: "Successfully Updated Password"})
            }).catch(err => {
                setError(err.response);
            });

        }
    }

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError({});
        setInfo({});
        const submitError = validateEmail()

        if (!submitError) {
            await typeApi.put(`/user/email`, {email}).then((res) => {
                setChange(false)
                setReset(false)
                setData({...data, email: res.data.email})
                setInfo({statusText: "Successfully Updated Email"})
            }).catch(err => {
                setError(err.response);
            });
        }
    }

    return (<div><NavComponent tanks={false}/>
        <div style={width > 770 ? {paddingInline: "30%"} : {paddingInline: "10%"}}
             className={"ui middle aligned center aligned padded grid"}>
            <div className={"column"}>
                <div className="ui horizontal divider"/>
                {
                    Object.keys(error).length !== 0 ?
                        <Message messageType={'error'} message={error.statusText} onClose={() => {
                            setError({})
                        }}/>
                        : null
                }
                {
                    Object.keys(info).length !== 0 ?
                        <Message messageType={'info'} message={info.statusText} onClose={() => {
                            setInfo({})
                        }}/>
                        : null
                }
                <div>
                    <div className="ui horizontal divider"/>
                    <img className={"ui fluid image"} src={logo} alt={"logo"}/>
                    <h2 className="ui header">
                        Account Settings
                    </h2>
                    <h3 className="ui header">
                        Account Email / Username:
                    </h3>
                    <div style={{
                        borderStyle: 'solid',
                        borderWidth: '1px',
                        borderColor: 'lightgrey', padding: '5px', borderRadius: '4px'
                    }}><i className={'ui user outline icon'}/>{data ? data.email : null}</div>
                </div>
                <div className="ui horizontal divider"/>
                {!reset ? <div className={"ui fluid large submit button"}
                               onClick={() => {
                                   setReset(true)
                               }}>Reset Password
                    </div> :
                    <form className={"ui form"}>
                        <label><h2>Reset Password</h2></label>
                        <div className={"ui stacked segment"}>
                            <div className={"field"}>
                                <div className={"ui left icon input"}>
                                    <i className={"key icon"}/>
                                    <input
                                        type="password"
                                        placeholder="Old Password"
                                        autoCapitalize="none"
                                        autoCorrect="false"
                                        onChange={e => {
                                            setOldPassword(e.target.value)
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
                                        autoCapitalize="none"
                                        autoCorrect="false"
                                        onChange={e => {
                                            setPassword(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={"field"}>
                                <div className={"ui left icon input"}>
                                    <i className={"key icon"}/>
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        autoCapitalize="none"
                                        autoCorrect="false"
                                        onChange={e => {
                                            setConfirmPassword(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={"ui fluid large submit button"}
                             onClick={handlePasswordSubmit}>Submit
                        </div>
                    </form>}
                <div className="ui horizontal divider"/>
                {!change ? <div className={"ui fluid large submit button"}
                                onClick={() => {
                                    setChange(true)
                                }}>Update Email
                    </div> :
                    <form className={"ui form"}>
                        <label><h2>Update Email</h2></label>
                        <div className={"ui stacked segment"}>
                            <div className={"field"}>
                                <div className={"ui left icon input"}>
                                    <i className={"user icon"}/>
                                    <input
                                        type="text"
                                        placeholder="New Email"
                                        autoCapitalize="none"
                                        autoCorrect="false"
                                        onChange={e => {
                                            setEmail(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={"ui fluid large submit button"}
                             onClick={handleEmailSubmit}>Submit
                        </div>
                    </form>}
            </div>
        </div>
    </div>);
}
export default AccountInfo;

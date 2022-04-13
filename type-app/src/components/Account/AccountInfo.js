import React, {useEffect, useState} from 'react';
import logo from "../../media/typeBfull.png";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import typeApi from "../../api/type-server";
import NavComponent from "../NavComponent";

const AccountInfo = () => {
    const [data, setData] = useState();
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [change, setChange] = useState(false);
    const [error, setError] = useState({});
    const [reset, setReset] = useState(false);
    const {height, width} = useWindowDimensions();

    useEffect(async () => {
        const data = await typeApi.get('user').then((res) => {
            return res.data[0]
        }).catch(err => {
            console.log(err.response)
            setError(err.response);
            console.error(err);
        });
        setData(data)
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
        const submitError = validatePass()

        if (!submitError) {
            await typeApi.post(`/user/password`, {oldPassword, password}).then(() => {
                setReset(false)
            })
                .catch(err => {
                    console.log(err.response)
                    setError(err.response);
                    console.error(err);
                });
        }
    }

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        const submitError = validateEmail()

        if (!submitError) {
            await typeApi.post(`/user/email`, {email}).then(() => {
                setReset(false)
            })
                .catch(err => {
                    console.log(err.response)
                    setError(err.response);
                    console.error(err);
                });
        }
    }

    return (<div><NavComponent tanks={false}/>
        <div style={width > 770 ? {paddingInline: "40%"} : {paddingInline: "10%"}}
             className={"ui middle aligned center aligned padded grid"}>
            <div className={"column"}>
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
                <div>
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
                                        value={oldPassword}
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
                                        value={password}
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
                                        value={confirmPassword}
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
                                        type="password"
                                        placeholder="New Email"
                                        value={email}
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

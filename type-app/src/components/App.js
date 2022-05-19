import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import BrewFloor from "./BrewFloor/BrewFloor";
import CreateTank from "./BrewFloor/CreateTank";
import CreateBeer from "./Beer/CreateBeer";
import AuthForm from "./Account/AuthForm";
import useToken from "./Hooks/useToken";
import CreateProcess from "./Process/CreateProcess";
import Process from "./Process/Processes";
import Fridge from "./Beer/Fridge";
import Calendar from "./Calendar/Calendar";
import AccountInfo from "./Account/AccountInfo";
import useWindowDimensions from "./Hooks/useWindowDimensions";
import './App.css';
import fourOfour from "./Messages/404";

const App = () => {

    const {token, setToken} = useToken();
    useWindowDimensions();

    if (!localStorage.getItem('token')) {
        return <AuthForm setToken={setToken}/>
    }
    return (
        <div id="switch">
            <BrowserRouter>
                <div>
                    <Route path="/" exact component={BrewFloor}/>
                    <Route path="/create/tank" exact component={CreateTank}/>
                    <Route path="/create/beer" exact component={CreateBeer}/>
                    <Route path="/create/process" exact component={CreateProcess}/>
                    <Route path="/fridge" exact component={Fridge}/>
                    <Route path="/calendar" exact component={Calendar}/>
                    <Route path="/processes" exact component={Process}/>
                    <Route path="/account" exact component={AccountInfo}/>
                    <Route path="*" exact component={fourOfour}/>
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;

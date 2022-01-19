import React, {useState} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import BrewFloor from "./BrewFloor/BrewFloor";
import CreateTank from "./BrewFloor/CreateTank";
import CreateBeer from "./Beer/CreateBeer";
import AuthForm from "./Account/AuthForm";
import useToken from "../hooks/useToken";
import CreateProcess from "./Process/CreateProcess";
import Process from "./Process/Process";
import Fridge from "./Beer/Fridge";
import Calendar from "./Calendar/Calendar";

const App = () => {

    const {token, setToken} = useToken();

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
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;

import React, {useState} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import BrewFloor from "./BrewFloor/BrewFloor";
import CreateTank from "./BrewFloor/CreateTank";
import CreateBeer from "./Beer/CreateBeer";
import AuthForm from "./Account/AuthForm";
import useToken from "../hooks/useToken";

const App = () => {

    const {token, setToken} = useToken();

    if (!localStorage.getItem('token')) {
        return <AuthForm setToken={setToken}/>
    }
    return (
        <div id="switch">
            <BrowserRouter>
                <div>
                    <Route path="/" exact component={() => (<BrewFloor tanks={true}/>)}/>
                    <Route path="/create/tank" exact component={CreateTank}/>
                    <Route path="/create/beer" exact component={CreateBeer}/>
                    <Route path="/fridge" exact component={() => (<BrewFloor tanks={false}/>)}/>
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;

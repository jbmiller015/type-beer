import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import BrewFloor from "./BrewFloor/BrewFloor";
import CreateTank from "./BrewFloor/CreateTank";
import CreateBeer from "./Beer/CreateBeer";
import CreateEvent from "./Event/CreateEvent";
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
import EventsHome from "./Event/EventsHome";

const App = () => {

    const {token, setToken} = useToken();
    useWindowDimensions();

    if (!localStorage.getItem('token')) {
        return <AuthForm setToken={setToken}/>
    }
    return (
        <div id="switch">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<BrewFloor/>}/>
                    <Route path="/create/tank" element={<CreateTank/>}/>
                    <Route path="/create/beer" element={<CreateBeer/>}/>
                    <Route path="/create/process" element={<CreateProcess/>}/>
                    <Route path="/create/event" element={<CreateEvent/>}/>
                    <Route path="/fridge" element={<Fridge/>}/>
                    <Route path="/calendar" element={<Calendar/>}/>
                    <Route path="/processes" element={<Process/>}/>
                    <Route path="/events" element={<EventsHome/>}/>
                    <Route path="/account" element={<AccountInfo/>}/>
                    <Route path="/404" element={<fourOfour/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;

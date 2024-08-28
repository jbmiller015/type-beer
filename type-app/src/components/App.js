import React from 'react';
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom';
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
    const navigate = useNavigate()

    if (!localStorage.getItem('token')) {
        return <AuthForm setToken={setToken}/>
    }
    return (
        <div id="switch">
            <Routes>
                <Route path="/" element={<BrewFloor/>}/>
                <Route path="/demo" element={<BrewFloor/>}/>
                <Route path="/create/tank" element={<CreateTank navigate={navigate}/>}/>
                <Route path="/create/beer" element={<CreateBeer navigate={navigate}/>}/>
                <Route path="/create/process" element={<CreateProcess navigate={navigate}/>}/>
                <Route path="/create/event" element={<CreateEvent navigate={navigate}/>}/>
                <Route path="/fridge" element={<Fridge/>}/>
                <Route path="/calendar" element={<Calendar/>}/>
                <Route path="/processes" element={<Process/>}/>
                <Route path="/events" element={<EventsHome/>}/>
                <Route path="/account" element={<AccountInfo/>}/>
                <Route path="/404" element={<fourOfour/>}/>
            </Routes>
        </div>
    );
};

export default App;

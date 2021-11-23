import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import BrewFloor from "./BrewFloor/BrewFloor";
import CreateTank from "./BrewFloor/CreateTank";
import CreateBeer from "./Beer/CreateBeer";
import BrewerFridge from "./Beer/BrewerFridge";

const App = () => {
    return (
        <div id="switch">
            <BrowserRouter>
                <div>
                    <Route path="/" exact component={BrewFloor}/>
                    <Route path="/create/tank" exact component={CreateTank}/>
                    <Route path="/create/beer" exact component={CreateBeer}/>
                    <Route path="/fridge" exact component={BrewerFridge}/>
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;

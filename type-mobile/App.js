import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import AccountScreen from "./src/screens/AccountScreen";
import {setNavigator} from "./src/navigationRef";

const switchNavigator = createSwitchNavigator({
    ResolveAuth: ResolveAuthScreen,
    loginFlow: createStackNavigator({
        Signup: SignUpScreen,
        Signin: SignInScreen,
    }),
    mainFlow: createBottomTabNavigator({
        Account: AccountScreen
    }),

});

const App = createAppContainer(switchNavigator);

export default () => {
    return (
        <App ref={(navigator) => {
            setNavigator(navigator)
        }}/>
    )
}
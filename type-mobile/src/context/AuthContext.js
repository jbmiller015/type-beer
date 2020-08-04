import createDataContext from "./createDataContext";
import typeApi from '../api/authorize';
import {AsyncStorage} from "react-native";
import {navigate} from "../navigationRef";

const authReducer = (state, action) => {
    switch (action.type) {
        case 'add_error':
            return {...state, errorMessage: action.payload};
        case 'signin':
            return {errorMessage: '', token: action.payload};
        case'clear_error_message':
            return {...state, errorMessage: ''};
        case 'signout':
            return {token: null, errorMessage: ''}
        default:
            return state;
    }
};

const tryLocalSignin = (dispatch) => async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        dispatch({type: 'signin', payload: token});
        navigate('mainFlow');
    } else {
        navigate('loginFlow')
    }
}

const clearErrorMessage = (dispatch) => () => {
    dispatch({type: 'clear_error_message'});
}

//Scaffolding for functions
const signup = (dispatch) => async ({email, password}) => {
    try {
        const response = await typeApi.post('/signup', {email, password});
        await AsyncStorage.setItem('token', response.data.token);
        dispatch({type: 'signin', payload: response.data.token});
        navigate('mainFlow');
    } catch (e) {
        dispatch({type: 'add_error', payload: 'Something went wrong w/ signup'});
    }
};


const signin = (dispatch) => async ({email, password}) => {
    try {
        const response = await typeApi.post('/signin', {email, password});
        await AsyncStorage.setItem('token', response.data.token);
        dispatch({type: 'signin', payload: response.data.token});
        navigate('mainFlow');
    } catch (e) {
        dispatch({type: 'add_error', payload: 'Something went wrong with sign in'});
    }
};

const signout = (dispatch) => async () => {
    await AsyncStorage.removeItem('token');
    dispatch({type: 'signout'});
    navigate('loginFlow');
};


export const {Provider, Context} = createDataContext(
    authReducer,
    {signin, signout, signup, clearErrorMessage, tryLocalSignin},
    {token: null, errorMessage: ''}
);
import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {Context as AuthContext} from '../context/AuthContext';
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";
import {NavigationEvents} from 'react-navigation';

const SignInScreen = ({navigation}) => {
    const {state, signin, clearErrorMessage} = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <NavigationEvents onWillFocus={clearErrorMessage}/>
            <AuthForm
                headerText="Sign In to Tracker"
                errorMessage={state.errorMessage}
                submitButtonText="Sign In"
                onSubmit={signin}
            />
            <NavLink
                routeName="Signup"
                promptText="Dont have an account yet? Sign up!"
            />
        </View>
    );
};

SignInScreen.navigationOptions = () => {
    return {
        header: () => false,
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 200
    },

});

export default SignInScreen;
import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {Context as AuthContext} from '../context/AuthContext';
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";
import {NavigationEvents} from "react-navigation";

const SignUpScreen = ({navigation}) => {
    const {state, signup, clearErrorMessage} = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <NavigationEvents onWillFocus={clearErrorMessage}/>
            <AuthForm
                headerText="Sign Up for Type-Beer"
                errorMessage={state.errorMessage}
                submitButtonText="Sign Up"
                onSubmit={signup}
            />
            <NavLink
                routeName="Signin"
                promptText="Already have an account? Sign in!"
            />
        </View>
    );
};

SignUpScreen.navigationOptions = () => {
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

export default SignUpScreen;

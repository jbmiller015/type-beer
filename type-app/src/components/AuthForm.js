import React, {useState} from "react";


const AuthForm = ({headerText, errorMessage, onFormSubmit, submitButtonText}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <h3>{headerText}</h3>
            <form>
                <input
                    type="text"
                    value={email}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <input
                    type="text"
                    value={password}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {
                    errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null
                }
                <input type="submit" value="Submit" onSubmit={() => onFormSubmit({email, password})}/>
            </form>
        </div>
    );
};
const styles = StyleSheet.create({
    errorMessage: {
        fontSize: 16,
        color: 'red',
        marginLeft: 15
    },
});

export default AuthForm;

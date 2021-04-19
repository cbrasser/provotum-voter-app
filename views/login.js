import React from 'react';
import {
    View
} from 'react-native';
import { useColorScheme, StatusBar, SafeAreaView, KeyboardAvoidingView, TextInput, Text, Platform, TouchableWithoutFeedback, Button, Keyboard } from 'react-native';

const styles = require('./../style');
//const isDarkMode = useColorScheme() === 'dark';

const Login = ({ navigation }) => {

    const submitSeedPhrase = () => navigation.navigate('votes', { name: 'Jane' });
    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <View style={styles.inner}>
                    <Text style={styles.header}>Enter seed phrase</Text>
                    <TextInput placeholder="Seed" style={styles.textInput} />
                    <View style={styles.btnContainer}>
                        <Button title="Submit" onPress={submitSeedPhrase} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

    )
};



export default Login;
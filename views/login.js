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

        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={true ? 'light-content' : 'dark-content'} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Text style={styles.header}>Enter seed phrase</Text>
                        <TextInput placeholder="Seed" style={styles.textInput} />
                        <View style={styles.btnContainer}>
                            <Button title="Submit" onPress={submitSeedPhrase} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>

    )
};



export default Login;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    View
} from 'react-native';
import { useColorScheme, StatusBar, SafeAreaView, KeyboardAvoidingView, TextInput, Text, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextField, Button } from 'react-native-ios-kit';
import useSubstrate from '.././substrate-lib/useSubstrate';
import { createVoterWallet } from './../redux/voter/voterSlice';
import { getIdentityProviderPublicKey } from './../redux/idp/idpSlice';
import { blindAddress, registerVoter, selectAddressSubmitted } from './../redux/voter/voterSlice';

const styles = require('./../style');
//const isDarkMode = useColorScheme() === 'dark';

const Login = ({ navigation }) => {
    const [seed, setSeed] = useState('');
    const dispatch = useDispatch();
    const isRegistered = useSelector(selectAddressSubmitted);
    const [isInitializing, setIsInitializing] = useState(false);

    const { keyring, keyringState, api } = useSubstrate();


    useEffect(() => {
        if (isRegistered) {
            navigation.navigate('votes', { name: 'Jane' })
        }
    });

    const registerBySeedPhrase = async () => {
        console.log('keyringstate: ', keyringState)
        console.log('keyring: ', keyring);
        console.log('is initializing: ', isInitializing);
        if (keyringState === 'READY' && api) {
            setIsInitializing(true);
            console.log('Registering voter...', seed);

            const voterKeyringPair = await dispatch(createVoterWallet(keyring, `//${seed}`));
            console.log('Created voter wallet', voterKeyringPair);

            console.log('Fetching identity provider public key');
            const idpParams = await dispatch(getIdentityProviderPublicKey());
            console.log('idp params: ', idpParams.payload);

            console.log('Blinding wallet and sending it to the IdP for signing');
            const signature = await dispatch(blindAddress(voterKeyringPair.addressRaw, idpParams.payload));

            console.log('Registering voter');
            const result = await dispatch(registerVoter(api, signature, voterKeyringPair));
            console.log('result: ', result);
            if (result) {
                navigation.navigate('votes', { name: 'Jane' })
            }
        }
    };

    const submitSeedPhrase = async () => {
        registerBySeedPhrase().catch((error) => console.error(error));
    };
    const navigateToVotes = () => {
        navigation.navigate('votes', { name: 'Jane' })
    }
    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <View style={styles.inner}>
                    <Text style={styles.header}>Enter seed phrase</Text>
                    <TextField value={seed} onValueChange={(v) => { setSeed(v) }} placeholder="Seed" style={styles.textInput} />
                    <View style={styles.btnContainer}>
                        <Button rounded onPress={submitSeedPhrase}>
                            Submit
                        </Button>
                        <Button rounded onPress={navigateToVotes}>
                            browse without login
                        </Button>

                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

    )
};



export default Login;
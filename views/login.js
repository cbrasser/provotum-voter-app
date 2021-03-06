/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { View, ActionSheetIOS } from 'react-native';
import {
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
} from 'react-native';
import { TextField, Button } from 'react-native-ios-kit';
import useSubstrate from '.././substrate-lib/useSubstrate';
import { createVoterWallet } from './../redux/voter/voterSlice';
import { getIdentityProviderPublicKey } from './../redux/idp/idpSlice';
import {
    loadCastBallots,
    blindAddress,
    registerVoter,
    selectAddressSubmitted,
    voterIsRegistered,
    wipeVoterData,
} from './../redux/voter/voterSlice';
import * as Keychain from 'react-native-keychain';
import { Body, Icon } from 'react-native-ios-kit';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

var Spinner = require('react-native-spinkit');

const styles = require('./../style');
//const isDarkMode = useColorScheme() === 'dark';
const Login = ({ navigation }) => {
    const [seed, setSeed] = useState('');
    const dispatch = useDispatch();

    const [initPhase, setinitPhase] = useState(0);
    const isRegistered = useSelector(selectAddressSubmitted);
    const [seedStoredOnDevice, setSeedStoredOnDevice] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    //const voterWallet = useSelector(selectKeyringPair)
    const { keyring, keyringState, api, apiState } = useSubstrate();

    const wait = milliseconds => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };


    /*
    This routine is called upon start of the application and may not be completely 
    intuitive. It basically checks whether there is a wallet seed stored on the local
    storage of the device, and then if the wallet has already been registered with Provotum.
    The 'wait' statements serve no purpose other than making the loading icons visible for a moment
    in order to inform the user on what is going on. They may not be needed in a production
    environment where load times get longer. 

    I intentionally left the console logs in here when i had to finish coding in order to make 
    development a bit easier on the next dev, because RN debugging on the simulator is a bit of a 
    pain and often console is the best way to go.
    */
    const goThroughSetup = async () => {
        console.log('loading cast ballots');
        await dispatch(loadCastBallots());
        let credentials = await loadFromKeychain();
        console.log('done loading credentials, ', credentials);

        await wait(1000);
        // if there is a seed stored in the keystore use it and check if it has already been signed and stored
        if (credentials) {
            console.log('found credentials on device');
            setinitPhase(1);
            await wait(1000);
            setinitPhase(2);
            console.log('loading wallet');
            const wallet = await initializeVoterWallet();
            await wait(1000);
            console.log('checking if address is registered on the chain');
            let addressOnChain = await checkAddressOnBlockchain(wallet);
            // if the address has already been signed and stored everything is ready and the user
            // is redirected to the votes screen
            if (addressOnChain) {
                console.log('voter already registered on BC');
                setinitPhase(3);
                await wait(1000);
                //navigation.navigate('votes', { name: 'Jane' })
                // else sign and store the address first
            } else {
                setinitPhase(5);
                await wait(1000);
                console.log('voter not yet on BC, blinding and registering');
                console.log('Fetching identity provider public key');
                const idpParams = await dispatch(getIdentityProviderPublicKey());
                setinitPhase(6);
                await wait(1000);
                console.log('Blinding wallet and sending it to the IdP for signing');
                const signature = await dispatch(
                    blindAddress(wallet.addressRaw, idpParams.payload),
                );
                setinitPhase(7);
                await wait(1000);
                const result = await dispatch(registerVoter(api, signature, wallet));
                console.log('result: ', result);
                if (result) {
                    setinitPhase(8);
                    await wait(1000);
                    setinitPhase(3);
                    //navigation.navigate('votes', { name: 'Jane' })
                }
            }
            //let test = await registerBySeedPhrase(false);
            // else wait for the user to manually submitt a seed
        } else {
            setinitPhase(4);
            console.log('no seed on device');
        }
    };

    useEffect(async () => {
        goThroughSetup();
    }, [keyring, api]);


    const initializeVoterWallet = async () => {
        let wallet = await dispatch(createVoterWallet(keyring, `//${seed}asdsfaa`));
        return wallet;
    };

    const checkAddressOnBlockchain = async voterWallet => {
        const result = await dispatch(voterIsRegistered(api, voterWallet));
        console.log(result);
        return result;
    };

    const registerBySeedPhrase = async () => {
        //console.log('keyringstate: ', keyringState)
        //console.log('keyring: ', keyring);
        //console.log('is initializing: ', isInitializing);
        if (keyringState === 'READY' && api) {
            setIsInitializing(true);
            console.log('Registering voter...', seed);

            const voterKeyringPair = await dispatch(
                createVoterWallet(keyring, `//${seed}`),
            );
            console.log('Created voter wallet', voterKeyringPair);

            console.log('Fetching identity provider public key');
            const idpParams = await dispatch(getIdentityProviderPublicKey());
            console.log('idp params: ', idpParams.payload);

            console.log('Blinding wallet and sending it to the IdP for signing');
            const signature = await dispatch(
                blindAddress(voterKeyringPair.addressRaw, idpParams.payload),
            );

            console.log('Registering voter with signature: ', signature);
            const result = await dispatch(
                registerVoter(api, signature, voterKeyringPair),
            );
            console.log('result: ', result);

            await Keychain.setGenericPassword('someUsername', seed, {
                accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
                //securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
                //storage: Keychain.STORAGE_TYPE.AES,
                authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
                biometryType: Keychain.BIOMETRY_TYPE.FACE_ID,
            });

            return result;
        }
    };

    const submitSeedPhrase = async () => {
        let result = await registerBySeedPhrase();
        if (result) {
            setinitPhase(3);
            navigation.navigate('votes', { name: 'Jane' });
        }
    };
    const loadFromKeychain = async () => {
        const options = {
            authenticationPrompt: {
                title: 'Authentication needed',
                subtitle: 'Subtitle',
                description: 'Some descriptive text',
                cancel: 'Cancel',
            },
        };
        try {
            console.log('loading from keychain');
            const credentials = await Keychain.getGenericPassword(options);
            if (credentials) {
                return credentials;
            } else {
                console.log('no credentials stored');
                return false;
            }
        } catch (e) {
            console.log(e);
        }
        return false;
    };
    const navigateToVotes = () => {
        navigation.navigate('votes');
    };
    const navigateToIntro = () => {
        navigation.navigate('intro');
    };

    const openNukeDialog = async () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', 'Do it'],
                destructiveButtonIndex: 1,
                cancelButtonIndex: 0,
                userInterfaceStyle: 'light',
                title: 'Wipe Data',
                message: 'Remove all local data',
            },
            buttonIndex => {
                if (buttonIndex === 1) {
                    dispatch(wipeVoterData());
                    goThroughSetup();
                } else if (buttonIndex === 0) {
                }
            },
        );
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.login}>
            <Button style={styles.helpButton} onPress={navigateToIntro}>
                <Icon name={'ios-help-circle-outline'} size={30} color={'blue'} />
            </Button>
            <Button style={styles.nukeButton} onPress={openNukeDialog}>
                <Icon name={'ios-flash-outline'} size={30} color={'blue'} />
            </Button>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    {initPhase === 0 && (
                        <View style={styles.loginView}>
                            <Spinner
                                style={styles.spinner}
                                isVisible={true}
                                size={40}
                                type={'wave'}
                            />
                            <Body style={styles.loginText}>Looking for your credentials</Body>
                        </View>
                    )}
                    {initPhase === 1 && (
                        <View style={styles.loginView}>
                            <Icon name={'ios-map-outline'} size={30} color={'blue'} />
                            <Body style={styles.loginText}>Found your credentials</Body>
                        </View>
                    )}
                    {initPhase === 4 && (
                        <QRCodeScanner
                            onRead={e => {
                                setSeed(e.data);
                                submitSeedPhrase();
                            }}
                            flashMode={RNCamera.Constants.FlashMode.torch}
                            topContent={
                                <View style={styles.genericCenter}>
                                    <Body>
                                        Please scan your secret code or enter your seed manually
                                    </Body>
                                </View>
                            }
                            bottomContent={
                                <View style={styles.genericCenter}>
                                    <TextField
                                        secureTextEntry={true}
                                        value={seed}
                                        onValueChange={v => {
                                            setSeed(v);
                                        }}
                                        placeholder="Seed"
                                        style={styles.textInput}
                                    />
                                    <Button
                                        style={{ marginTop: 10 }}
                                        rounded
                                        onPress={submitSeedPhrase}>
                                        Submit
                                    </Button>
                                </View>
                            }
                        />
                    )}
                    {initPhase === 2 && (
                        <View style={styles.loginView}>
                            <Spinner
                                style={styles.spinner}
                                isVisible={true}
                                size={40}
                                type={'wave'}
                            />
                            <Body style={styles.loginText}>
                                Searching for you on the blockchain
                            </Body>
                        </View>
                    )}
                    {initPhase === 3 && (
                        <View style={styles.loginView}>
                            <Image
                                style={styles.checkImage}
                                source={require('./../assets/check.gif')}
                            />
                            <Body style={styles.loginText}>
                                You are registered on the blockchain
                            </Body>
                            <Button rounded inverted onPress={navigateToVotes}>
                                browse votes
                            </Button>
                        </View>
                    )}
                    {initPhase === 5 && (
                        <View style={styles.loginView}>
                            <Spinner
                                style={styles.spinner}
                                isVisible={true}
                                size={40}
                                type={'wave'}
                            />
                            <Body style={styles.loginText}>
                                Contacting the identity provider
                            </Body>
                        </View>
                    )}
                    {initPhase === 6 && (
                        <View style={styles.loginView}>
                            <Spinner
                                style={styles.spinner}
                                isVisible={true}
                                size={40}
                                type={'wave'}
                            />
                            <Body style={styles.loginText}>
                                securely blinding your address
                            </Body>
                        </View>
                    )}
                    {initPhase === 7 && (
                        <View style={styles.loginView}>
                            <Spinner
                                style={styles.spinner}
                                isVisible={true}
                                size={40}
                                type={'wave'}
                            />
                            <Body style={styles.loginText}>
                                Registrating your voter address with the Blockchain
                            </Body>
                        </View>
                    )}
                    {initPhase === 8 && (
                        <View style={styles.loginView}>
                            <Spinner
                                style={styles.spinner}
                                isVisible={true}
                                size={40}
                                type={'wave'}
                            />
                            <Body style={styles.loginText}>Loading votes</Body>
                        </View>
                    )}
                    {initPhase === -1 && (
                        <View style={styles.loginView}>
                            <Spinner
                                style={styles.spinner}
                                isVisible={true}
                                size={40}
                                type={'wave'}
                            />
                            <Body style={styles.loginText}>
                                you are disconnected from the blockchain
                            </Body>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default Login;

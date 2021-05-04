import React, { useEffect, useState } from 'react';
import { PageControlView } from 'react-native-ios-kit';

import { Title1, Title3, Body, Button } from 'react-native-ios-kit'
import { View, Image } from 'react-native';
const styles = require('../style');
import { WebView } from 'react-native-webview';

const Intro = ({ navigation }) => {

    const navigateToLogin = () => {
        navigation.navigate('Login')
    }

    return (
        <View style={styles.intro}>

            <PageControlView style={styles.container}>
                <View style={styles.introSlide}>
                    <Title1>Welcom to Provotum</Title1>
                    <Body>How does it work?</Body>
                </View>
                <View style={styles.introSlide}>
                    <Image
                        style={styles.networkImage}
                        source={require('./../assets/network.gif')}
                    />
                    <Body>Everyone connects to the network</Body>
                </View>
                <View style={styles.introSlide}>
                    <Image
                        style={styles.networkImage}
                        source={require('./../assets/coding.gif')}
                    />
                    <Body>Code on the Blockchain makes is super secure</Body>
                </View>
                <View style={styles.introSlide}>
                    <Title1>K, got it</Title1>
                    <Button onPress={navigateToLogin}>take me back</Button>
                </View>
            </PageControlView>

        </View >

    )
};

export default Intro;
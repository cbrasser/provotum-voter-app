import React from 'react';
import { PageControlView } from 'react-native-ios-kit';

import { Title1, Title3, Body, Button } from 'react-native-ios-kit'
import { View, Image } from 'react-native';
const styles = require('../style');


/*
This is the view shown when the info/help button in the login screen is tapped. The idea
is to create some sort of informational tutorial that helps the user, however i did 
not have the time to actually create the tutorial content. 
*/
const Intro = ({ navigation }) => {

    const navigateToLogin = () => {
        navigation.navigate('Login')
    }

    return (
        <View style={styles.intro}>

            <PageControlView style={styles.container}>
                <View style={styles.introSlide}>
                    <Title1>Welcom to Provotum</Title1>
                    <Body>This is a short introduction to how it works</Body>
                </View>
                <View style={styles.introSlide}>
                    <Image
                        style={styles.networkImage}
                        source={require('./../assets/walking.gif')}
                    />
                    <Body>With Provotum, you can cast votes on the go</Body>
                </View>
                <View style={styles.introSlide}>
                    <Image
                        style={styles.networkImage}
                        source={require('./../assets/network.gif')}
                    />
                    <Body>Everyone is connected to the same network</Body>
                </View>
                <View style={styles.introSlide}>
                    <Image
                        style={styles.networkImage}
                        source={require('./../assets/coder.gif')}
                    />
                    <Body>Everyone can verify the results</Body>
                </View>
                <View style={styles.introSlide}>
                    <Image
                        style={styles.networkImage}
                        source={require('./../assets/coding.gif')}
                    />
                    <Body>And the code is publicely available</Body>
                </View>
                <View style={styles.introSlide}>
                    <Title1>I am ready</Title1>
                    <Button onPress={navigateToLogin}>Let's get started</Button>
                </View>
            </PageControlView>

        </View >

    )
};

export default Intro;
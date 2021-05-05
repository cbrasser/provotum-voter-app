import React from 'react';

import { StyleSheet, Text, View, Image } from 'react-native'
import { Body } from 'react-native-ios-kit'
import LoadingIcon from './LoadingIcon';
var Spinner = require('react-native-spinkit');

const styles = require('./../style');

const stylessheet = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 15,
    },
    card: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8FBCBB',
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,

    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 50

    }
})
const BallotLoading = (props) => {

    return (
        <View style={stylessheet.wrapper}>
            <View style={stylessheet.card}>
                <LoadingIcon></LoadingIcon>
                <Body style={stylessheet.text}>Encrypting and submitting your ballot</Body>
            </View>

        </View >

    )
};



export default BallotLoading;
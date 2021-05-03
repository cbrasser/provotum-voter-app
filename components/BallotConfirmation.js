import Swiper from 'react-native-swiper'
import React, { useEffect, useState, } from 'react';
import { Title1, Title3, Body, Button } from 'react-native-ios-kit'
import { AppRegistry, StyleSheet, Text, View, Linking, PlatformColor } from 'react-native'
import { selectBallotsState, selectBallotSubmitted, selectBlockHash } from './../redux/ballots/ballotsSlice';
import { useDispatch, useSelector } from 'react-redux';
var Spinner = require('react-native-spinkit');

const styles = require('./../style');

const stylessheet = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 15,
    },
    card: {
        flex: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1EC337',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'tomato'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: PlatformColor('systemBackground'),

    }
})
const BallotConfirmation = (props) => {
    //const voteId = props.voteId;
    const ballot = props.ballot;

    const openLink = () => {
        Linking.openURL(`https://polkadot.js.org/apps/?rpc=${encodeURIComponent(config.PROVIDER_SOCKET)}#/explorer/query/${ballot.blockHash.toString()}`)
    }
    return (
        <View style={stylessheet.wrapper}>

            <View style={stylessheet.card}>
                <Text style={stylessheet.text}>Your ballot for this vote is securely stored</Text>
                <Button style={styles.button} inline centered rounded inverted onPress={() => { openLink() }}>
                    see on chain explorer
</Button>

            </View>
            {
                false ? (
                    <View style={stylessheet.slide3}>
                        <Text style={stylessheet.text}>Something went wrong with sending your ballot</Text>
                    </View>
                ) : null
            }



        </View >

    )
};



export default BallotConfirmation;
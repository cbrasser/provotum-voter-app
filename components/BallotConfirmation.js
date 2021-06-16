/* eslint-disable prettier/prettier */

import React from 'react';
import { Body, Button } from 'react-native-ios-kit'
import { StyleSheet, View, Linking } from 'react-native'



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
        backgroundColor: '#A3BE8C',
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
        textAlign: 'center',
        marginBottom: 50
        //color: PlatformColor('systemBackground'),

    }
})
const BallotConfirmation = (props) => {
    //const voteId = props.voteId;
    const ballot = props.ballot;
    console.log('block', ballot.block);

    console.log('block extrinsics', ballot.block.block.extrinsics);
    console.log('block header ', ballot.block.block.header);
    const openLink = () => {
        Linking.openURL(`https://polkadot.js.org/apps/?rpc=${encodeURIComponent(config.PROVIDER_SOCKET)}#/explorer/query/${ballot.blockHash.toString()}`)
    }
    return (
        <View style={stylessheet.wrapper}>

            <View style={stylessheet.card}>

                <Body style={stylessheet.text}>Your ballot for this vote is securely stored</Body>
                <Button style={styles.button} inline centered rounded onPress={() => { openLink() }}>
                    see on chain explorer
                </Button>

            </View>
            {
                false ? (
                    <View style={stylessheet.slide3}>
                        <Body style={stylessheet.text}>Something went wrong with sending your ballot</Body>
                    </View>
                ) : null
            }



        </View >

    )
};



export default BallotConfirmation;
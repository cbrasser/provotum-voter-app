import React from 'react';

import { StyleSheet, Text, View } from 'react-native'

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
        backgroundColor: '#9DD6EB',
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
        fontWeight: 'bold',
        textAlign: 'center'

    }
})
const BallotLoading = (props) => {

    return (
        <View style={stylessheet.wrapper}>
            <View style={stylessheet.card}>
                <Spinner style={styles.spinner} isVisible={true} size={40} type='wave' />
                <Text style={stylessheet.text}>Encrypting and submitting your ballot</Text>
            </View>

        </View >

    )
};



export default BallotLoading;
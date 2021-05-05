import Swiper from 'react-native-swiper'
import React, { useEffect, useState, } from 'react';
import { Title1, Title3, Body, Button } from 'react-native-ios-kit'
import { AppRegistry, StyleSheet, Image, View, Linking, PlatformColor } from 'react-native'
import { selectBallotsState, selectBallotSubmitted, selectBlockHash } from './../redux/ballots/ballotsSlice';
import { useDispatch, useSelector } from 'react-redux';


const styles = require('./../style');

const stylessheet = StyleSheet.create({
    wrapper: {
        backgroundColor: 'white',
        borderRadius: 75,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        height: 100,
        width: 100,
        elevation: 12,
    },
    image: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0
    }
})
const SuccessIcon = (props) => {
    //const voteId = props.voteId;

    return (
        <View style={stylessheet.wrapper}>
            <Image
                style={stylessheet.image}
                source={require('./../assets/check.gif')}
            />
        </View >

    )
};



export default SuccessIcon;
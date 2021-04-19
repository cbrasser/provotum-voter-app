import React, { useEffect } from 'react';
import {
    StatusBar, SafeAreaView
} from 'react-native';
import { useDispatch } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import { getElections } from './redux/elections/electionSlice';
import Login from './views/login';
import Votes from './views/votes';
//import useSubstrate from '../substrate/useSubstrate';
const styles = require('./style');


const StoreManager = (props) => {
    console.log(props)
    const vaUrl = 'localhost:3000';
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('loading elections')
        dispatch(getElections(vaUrl));

    }, [dispatch]);
    //const { keyring, keyringState, api } = useSubstrate();

    /*useEffect(() => {
        if (api) {
            console.log('Initializing...');
            dispatch(getElections(api));
        }
    }, [dispatch, api]);*/
    return (


        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen

                    name="Login"
                    component={Login}
                    options={{ title: 'Login' }}
                />
                <Stack.Screen name="votes" component={Votes} />
            </Stack.Navigator>
        </NavigationContainer>

    )
};



export default StoreManager;
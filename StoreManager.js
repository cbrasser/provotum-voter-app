import React, { useEffect } from 'react';
import {
    StatusBar, SafeAreaView
} from 'react-native';
import { useDispatch } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import { getElections } from './redux/elections/electionSlice';

import { connect } from './redux/substrate/substrateSlice';
import { getAPI } from './redux/substrate/api';

import Login from './views/login';
import Votes from './views/votes';
//import useSubstrate from './substrate/useSubstrate';


const StoreManager = () => {
    const vaUrl = 'localhost:3000';
    const providerSocket = 'ws://localhost:9944'
    const dispatch = useDispatch();
    let api = undefined;
    // const substrate = useSubstrate();
    //console.log(substrate);

    useEffect(() => {
        console.log('loading elections')
        //dispatch(getElections(vaUrl));

    }, [dispatch]);

    useEffect(async () => {
        console.log('connecting to chain')
        api = await getAPI();
        console.log('connected');
        dispatch(getElections(api));
        // console.log(api.genesisHash.toHex());

    }, [dispatch, getElections]);


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
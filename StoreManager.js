import React, { useEffect } from 'react';
import {
    PlatformColor
} from 'react-native';
import { useDispatch } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import { getElections } from './redux/votes/votesSlice';


import Login from './views/login';
import Votes from './views/votes';
import Vote from './views/vote';
import Subject from './views/subject';
import useSubstrate from './substrate-lib/useSubstrate';


const StoreManager = () => {
    const vaUrl = 'localhost:3000';
    const providerSocket = 'ws://localhost:9944'
    const dispatch = useDispatch();
    //let api = undefined;
    //const substrate = useSubstrate();
    //console.log(substrate);

    const { keyring, keyringState, api } = useSubstrate();

    useEffect(() => {
        if (api) {
            console.log('Initializing...');
            dispatch(getElections(api));
        }
    }, [dispatch, api]);


    return (


        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen

                    name="Login"
                    component={Login}
                    options={{ title: 'Provotum', name: 'Login' }}
                />
                <Stack.Screen name="votes" component={Votes} />
                <Stack.Screen
                    name="vote"
                    component={Vote}
                    options={({ route }) => (
                        {
                            title: route && route.params ? route.params.title : '',
                            headerStyle: {
                                backgroundColor: PlatformColor('systemBackground'),
                            },
                            headerTintColor: PlatformColor('label'),
                            headerTitleStyle: {
                                fontWeight: 'bold',
                                display: 'none',
                            },
                            //headerTitle: props => <Title1 {...props}>{route.params.title}</Title1>
                        })
                    }

                />
                <Stack.Screen
                    name="subject"
                    component={Subject}
                    options={({ route }) => (
                        {
                            title: route && route.params ? route.params.title : '',
                            headerStyle: {
                                backgroundColor: PlatformColor('systemBackground'),
                            },
                            headerTintColor: PlatformColor('label'),
                            headerTitleStyle: {
                                fontWeight: 'bold',
                                display: 'none',
                            },
                            //headerTitle: props => <Title1 {...props}>{route.params.title}</Title1>
                        })
                    }

                />
            </Stack.Navigator>
        </NavigationContainer>

    )
};



export default StoreManager;
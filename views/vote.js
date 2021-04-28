import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Text, TouchableOpacity, FlatList, View } from 'react-native';
import { Title1, Body, Button } from 'react-native-ios-kit'
import { selectElectionById } from '../redux_1/elections/electionSlice';
const styles = require('./../style');


const Vote = ({ navigation, route }) => {

    const id = route.params.id;
    const election = useSelector((state) => selectElectionById(state, id));
    console.log(navigation);
    console.log(route);
    useEffect(() => {
        route.name = 'arstart';
    });

    const castVote = (vote) => {
        console.log('casting vote ', vote)
    };


    return (
        <View style={styles.electionList}>
            <Title1>{election.title}</Title1>
            <Body>{election.phase}</Body>
            {election.phase === 'Voting' &&
                (<View>
                    <Button onPress={() => { castVote(true) }} style={styles.button} inline rounded>
                        Yes
                </Button>
                    <Button onPress={() => { castVote(false) }} style={styles.button} inline rounded>
                        No
                </Button>
                </View>)
            }

        </View>

    )
};



export default Vote;
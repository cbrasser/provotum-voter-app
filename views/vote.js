import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Text, TouchableOpacity, FlatList, View } from 'react-native';
import { Title1, Title3, Body, Button } from 'react-native-ios-kit'
import { selectElectionById } from '../redux/votes/votesSlice';
import { selectAddressSubmitted, selectKeyringPair } from './../redux/voter/voterSlice';
import { answerSubject } from './../redux/votes/votesSlice';
import { castBallot } from './../redux/ballots/ballotsSlice';
import useSubstrate from './../substrate-lib/useSubstrate';

const styles = require('./../style');


const Vote = ({ navigation, route }) => {
    const userIsRegistered = useSelector(selectAddressSubmitted);
    const id = route.params.id;
    const election = useSelector((state) => selectElectionById(state, id));
    const keyringPair = useSelector(selectKeyringPair);
    const { api, apiState } = useSubstrate();

    const dispatch = useDispatch();
    //console.log(election);

    useEffect(() => {
        route.name = 'arstart';
    });


    const navigateToLogin = () => {
        navigation.navigate('login');
    }


    const castVote = () => {
        dispatch(castBallot(election, keyringPair, api))
    };

    const VoteSubject = ({ id, title }) => {
        const [selectedAnswer, setSelectedAnswer] = useState(false);

        const bufferSubjectAnswer = (subjectId, answer) => {
            setSelectedAnswer(answer);
            dispatch(answerSubject(election.electionId, subjectId, answer))
        }

        return (
            <View style={styles.electionList}>
                <Title3>{title}</Title3>
                {(election.phase === 'Voting' && userIsRegistered) &&
                    (<View>
                        <Button onPress={() => { bufferSubjectAnswer(id, true) }} style={styles.button} inline rounded disabled={selectedAnswer}>
                            Yes
                </Button>
                        <Button onPress={() => { bufferSubjectAnswer(id, false) }} style={styles.button} inline rounded disabled={!selectedAnswer}>
                            No
                </Button>
                    </View>)
                }
            </View>);

    };

    const renderSubjects = ({ item }) => (
        <VoteSubject title={item[1]} id={item[0]} />
    );

    return (
        <View style={styles.electionList}>
            <Title1>{election.title}</Title1>
            <Body>{election.phase}</Body>
            <FlatList
                data={election.subjects}
                renderItem={renderSubjects}
                keyExtractor={item => item[0]}
            />
            {userIsRegistered && (
                <View>
                    <Button rounded onPress={() => { castVote() }}>
                        Submitt
                        </Button>
                </View>
            )}
            {!userIsRegistered && (
                <View>
                    <Button rounded onPress={navigateToLogin}>
                        Register to vote
                        </Button>
                </View>
            )}

        </View>

    )
};



export default Vote;
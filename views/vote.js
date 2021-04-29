import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Text, TouchableOpacity, FlatList, View } from 'react-native';
import { Title1, Title3, Body, Button } from 'react-native-ios-kit'
import { selectElectionById } from '../redux/votes/votesSlice';
import { selectAddressSubmitted, selectKeyringPair } from './../redux/voter/voterSlice';
import { answerSubject, subscribeToResults } from './../redux/votes/votesSlice';
import { castBallot } from './../redux/ballots/ballotsSlice';
import useSubstrate from './../substrate-lib/useSubstrate';
import { SwitchRow, InfoRow, RowItem } from 'react-native-ios-kit';

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
        if (id && api && apiState === 'READY') {
            dispatch(subscribeToResults(api, id));
        }
    }, [dispatch, api, apiState, id]);


    const navigateToLogin = () => {
        navigation.navigate('Login');
    }


    const castVote = () => {
        dispatch(castBallot(election, keyringPair, api))
    };

    const VoteSubject = ({ id, title }) => {
        const [selectedAnswer, setSelectedAnswer] = useState(false);
        if (election.phase === 'Tallying') {
            console.log(election);
        }
        const bufferSubjectAnswer = (subjectId, answer) => {
            setSelectedAnswer(answer);
            dispatch(answerSubject(election.electionId, subjectId, answer))
        }

        const displayResultInfo = () => {
            let results = election.results.find(r => r.subjectId === id);
            return results.no > results.yes ? 'declined' : 'accepted';
        }

        return (
            <View style={styles.electionList}>
                {(election.phase === 'Voting' && userIsRegistered) &&
                    (<SwitchRow
                        title={title}
                        value={selectedAnswer}
                        onValueChange={value => bufferSubjectAnswer(id, value)}
                    />)
                }
                {(election.phase === 'Tallying' && election.results) && (
                    <InfoRow title={title} info={displayResultInfo()} />
                )}
                {(election.phase === 'DistributedKeyGeneration' || (election.phase === 'Voting' && !userIsRegistered)) && (
                    <RowItem
                        //icon="ios-map-outline"
                        title={title}
                    />)}
            </View>);

    };

    const renderSubjects = ({ item }) => (
        <VoteSubject title={item[1]} id={item[0]} />
    );

    return (
        <View style={styles.electionList}>
            <Title1>{election.title}</Title1>
            {election.phase === 'Voting' && (
                <Body>This Vote is currently in the voting phase and you can cast your ballot if you are eligible and have not voted yet!</Body>
            )}
            {election.phase === 'DistributedKeyGeneration' && (
                <Body>This vote is currently in the administration phase and will soon be opened for voting.</Body>
            )}
            {(election.phase === 'Tallying' && !election.results) && (
                <Body>This vote has been closed and is currently being tallied</Body>
            )}
            {(election.phase === 'Tallying' && election.results) && (
                <Body>This vote has been tallied and the results are available</Body>
            )}
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
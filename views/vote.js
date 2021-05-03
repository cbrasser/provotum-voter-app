import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Text, TouchableOpacity, FlatList, View, ActionSheetIOS } from 'react-native';
import { Title1, Title3, Body, Button } from 'react-native-ios-kit'
import { selectElectionById } from '../redux/votes/votesSlice';
import { selectAddressSubmitted, selectKeyringPair, selectVotesWithCastBallot, selectBallotForVote } from './../redux/voter/voterSlice';
import { answerSubject, subscribeToResults } from './../redux/votes/votesSlice';
import { selectBallotsState, selectBallotSubmitted, selectBlockHash } from './../redux/ballots/ballotsSlice';
import { castBallot } from './../redux/ballots/ballotsSlice';
import useSubstrate from './../substrate-lib/useSubstrate';
import { SwitchRow, NavigationRow, InfoRow, RowItem, TableView } from 'react-native-ios-kit';
import BallotConfirmation from '../components/BallotConfirmation';
import BallotLoading from './../components/BallotLoading';
const styles = require('./../style');


const Vote = ({ navigation, route }) => {
    const userIsRegistered = useSelector(selectAddressSubmitted);
    const id = route.params.id;
    const keyring = useSelector(selectKeyringPair);
    const election = useSelector((state) => selectElectionById(state, id));
    const keyringPair = useSelector(selectKeyringPair);
    const { api, apiState } = useSubstrate();
    const ballot = useSelector((state) => selectBallotForVote(state, election.electionId));
    const ballotState = useSelector(selectBallotsState);

    console.log('ballot: ', ballot);

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


    const castVote = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["cancel", "Submit"],
                destructiveButtonIndex: 0,
                cancelButtonIndex: 0,
                userInterfaceStyle: 'light'
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    // cancel action
                } else if (buttonIndex === 1) {
                    dispatch(castBallot(election, keyringPair, api))
                }
            }
        );

    const viewSubject = (electionId, subjectId) => {
        navigation.navigate('subject', { voteId: electionId, subjectId: subjectId })
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

        const resultInfo = () => {
            if (!election.results) {
                return ' ';
            }
            let results = election.results.find(r => r.subjectId === id);
            console.log('results: ', results);
            return results.no > results.yes ? 'declined' : 'accepted';
        }

        switch (election.phase) {
            case 'Voting':
                if (!ballot) {
                    return (<SwitchRow
                        title={title}
                        value={selectedAnswer}
                        onValueChange={value => bufferSubjectAnswer(id, value)}
                    />)
                } else {
                    return (<RowItem
                        title={title}
                    />)
                }

                break;
            case 'DistributedKeyGeneration':
                return (<RowItem
                    //icon="ios-map-outline"
                    title={title}
                />)
                break;
            case 'Tallying':
                return (
                    <NavigationRow
                        title={title}
                        subtitle={resultInfo()}
                        onPress={() => viewSubject(election.electionId, id)}
                    />
                )
            default:
                return null;
                break;
        }


    };

    const renderSubjects = election.subjects.map(s => (
        <VoteSubject key={s[0]} title={s[1]} id={s[0]} />
    ));


    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Title1 style={styles.title1} >{election.title}</Title1>
                {election.phase === 'Voting' ? (
                    <Body style={styles.electionInfo}>This Vote is currently in the voting phase and you can cast your ballot if you are eligible and have not voted yet!</Body>
                ) : null}
                {election.phase === 'DistributedKeyGeneration' ? (
                    <Body style={styles.electionInfo}>This vote is currently in the administration phase and will soon be opened for voting.</Body>
                ) : null}
                {(election.phase === 'Tallying' && !election.results) ? (
                    <Body style={styles.electionInfo}>This vote has been closed and is currently being tallied</Body>
                ) : null}
                {(election.phase === 'Tallying' && election.results) ? (
                    <Body style={styles.electionInfo}>This vote has been tallied and the results are available</Body>
                ) : null}
            </View>

            <TableView header="Subjects">
                {renderSubjects}
            </TableView>

            {(userIsRegistered && election.phase === 'Voting' && !ballot) ? (
                <View>
                    <Button rounded onPress={() => { castVote() }}>
                        Submitt
                        </Button>
                </View>
            ) : null}
            {!userIsRegistered ? (
                <View>
                    <Button rounded onPress={navigateToLogin}>
                        Register to vote
                        </Button>
                </View>
            ) : null}
            {ballot ? (<BallotConfirmation ballot={ballot}></BallotConfirmation>) : null}
            {(!ballot && ballotState === 'PENDING') ? (<BallotLoading />) : null}

        </View>

    )
};



export default Vote;
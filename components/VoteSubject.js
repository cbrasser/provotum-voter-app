import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Text, TouchableOpacity, FlatList, View } from 'react-native';
import { Title1, Body, Button } from 'react-native-ios-kit'
import { selectElectionById } from '../redux/votes/votesSlice';
import { selectAddressSubmitted } from './../redux/voter/voterSlice';

const styles = require('./../style');


const VoteSubject = ({ navigation, route }) => {
    const userIsRegistered = useSelector(selectAddressSubmitted);
    console.log(userIsRegistered);
    const id = route.params.id;
    const election = useSelector((state) => selectElectionById(state, id));


    const navigateToLogin = () => {
        navigation.navigate('login');
    }

    const [select, setSelect] = useState('');

    const onAnswer = (answer) => dispatch(answerSubject(id, subject[0], answer));

    const onClick = (option) => {
        const selectedOption = (select === option) ? '' : option;
        setSelect(selectedOption);
        onAnswer(selectedOption);
    };


    return (
        <View style={styles.electionList}>
            {(election.phase === 'Voting' && userIsRegistered) &&
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



export default VoteSubject;
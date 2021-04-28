import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Text, TouchableOpacity, FlatList, View } from 'react-native';
import { Headline } from 'react-native-ios-kit'
import { selectElections } from '../redux/votes/votesSlice';
const styles = require('./../style');


const Election = ({ data }) => (
    <View style={styles.item}>
        <Text style={styles.title}>{data}</Text>
    </View>
);

const renderElection = ({ election }) => (
    <Election data={election} />
);



const Votes = ({ navigation }) => {

    const viewElection = (electionId, electionTitle) => {
        console.log('viewing vote ', electionId)
        navigation.navigate('vote', { id: electionId, title: electionTitle })
    };


    const elections = useSelector(selectElections);
    //console.log('elections arrived on FE: ', elections)
    // const renderElections = elections.map(e => (<View><Text>{e.title}</Text></View>))

    const ElectionCard = ({ title, id }) => (
        <TouchableOpacity
            style={styles.electionCard}
            onPress={() => { viewElection(id, title) }}
        >
            <Headline>{title}</Headline>

        </TouchableOpacity>

    );


    const renderElection = ({ item }) => (
        <ElectionCard title={item.title} id={item.electionId} />
    );

    return (
        <View style={styles.electionList}>
            <FlatList
                data={elections}
                renderItem={renderElection}
                keyExtractor={item => item.electionId}
            />

        </View>

    )
};



export default Votes;
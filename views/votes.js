import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Text, Platform, FlatList, View } from 'react-native';
import { selectElections } from './../redux/elections/electionSlice';
const styles = require('./../style');


const Election = ({ data }) => (
    <View style={styles.item}>
        <Text style={styles.title}>{data}</Text>
    </View>
);

const renderElection = ({ election }) => (
    <Election data={election} />
);



const Votes = () => {



    const elections = useSelector(selectElections);
    const renderElections = elections.map(e => (<View><Text>{e.title}</Text></View>))


    return (
        <View style={styles.container}>
            {renderElections}
        </View>

    )
};



export default Votes;
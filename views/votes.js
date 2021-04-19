import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Text, Platform, FlatList, View } from 'react-native';
import { getElections, selectElections } from './../redux/elections/electionSlice';
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

    const vaUrl = 'localhost:3000'

    const dispatch = useDispatch();
    const elections = useSelector(selectElections);
    const renderElections = elections.map(e => (<View><Text>{e.title}</Text></View>))

    useEffect(() => {
        dispatch(getElections(vaUrl));

    }, [dispatch]);
    return (
        <View>
            {renderElections}
        </View>

    )
};



export default Votes;
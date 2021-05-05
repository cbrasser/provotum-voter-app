import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Text, TouchableOpacity, FlatList, View, ActionSheetIOS, PlatformColor } from 'react-native';
import { Title1, Title3, Body, Button } from 'react-native-ios-kit'
import { selectElectionById, selectElectionSubject, selectSubjectResults } from '../redux/votes/votesSlice';
import { VictoryLabel, VictoryTooltip, VictoryBar, VictoryChart, VictoryTheme, VictoryPie } from "victory-native";

const styles = require('./../style');


const wait = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const Vote = ({ navigation, route }) => {
    const voteId = route.params.voteId;
    const subjectId = route.params.subjectId;
    const election = useSelector((state) => selectElectionById(state, voteId));
    const subject = useSelector((state) => selectElectionSubject(state, voteId, subjectId))
    const results = useSelector((state) => selectSubjectResults(state, voteId, subjectId));

    const [data, setData] = useState([
        { y: 1, x: 'yes', label: "yes" },
        { y: 1, x: 'no', label: "no" },
    ]);


    useEffect(async () => {
        //await wait(1000);
        setData([
            { y: results.yes, x: 'yes', label: 'yes' },
            { y: results.no, x: 'no', label: 'no' },
        ])
    }, [setData]);

    //TODO: display link to finalization block of tally
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Title1 style={styles.title1} >{subject[1]}</Title1>
                <VictoryPie
                    animate={{
                        duration: 2000
                    }}
                    colorScale={["#A3BE8C", "#BF616A"]}
                    data={data}
                />

            </View>

        </View>

    )
};



export default Vote;
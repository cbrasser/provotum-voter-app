import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Text, TouchableOpacity, FlatList, View } from 'react-native';
import { Headline, SearchBar, NavigationRow, SegmentedControl, TableView } from 'react-native-ios-kit'
import { selectElections } from '../redux/votes/votesSlice';
const styles = require('./../style');







const Votes = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [selectedIndex, setselectedIndex] = useState(0);
    const viewElection = (electionId, electionTitle) => {
        console.log('viewing vote ', electionId)
        navigation.navigate('vote', { id: electionId, title: electionTitle })
    };


    const elections = useSelector(selectElections);
    let filteredElections = () => {
        let filteredByPhase = [];
        if (selectedIndex === 0) {
            filteredByPhase = elections.filter(e => e.phase === 'Voting');
        } else if (selectedIndex === 1) {
            filteredByPhase = elections.filter(e => e.phase === 'DistributedKeyGeneration');
        } else {
            filteredByPhase = elections.filter(e => e.phase === 'Tallying');
        }
        //console.log(filteredByPhase);
        return search.length > 0 ? filteredByPhase.filter(e => {
            console.log(search);
            let inTitle = e.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
            return inTitle;
        }) : filteredByPhase;
    }
    //console.log('elections arrived on FE: ', elections)
    // const renderElections = elections.map(e => (<View><Text>{e.title}</Text></View>))

    const ElectionCard = ({ title, id }) => (
        <NavigationRow
            title={title}
            onPress={() => { viewElection(id, title) }}
        />
    );

    const renderElections = filteredElections().map(e => (
        <ElectionCard key={e.electionId} title={e.title} id={e.electionId} />
    ));

    return (
        <View style={styles.electionList}>
            <SegmentedControl
                values={['open', 'upcoming', 'past']}
                selectedIndex={selectedIndex}
                onValueChange={(value, index) =>
                    setselectedIndex(index)
                }
                style={{ width: 222, alignSelf: 'center', marginTop: 10 }}
            />
            <SearchBar
                value={search}
                onValueChange={text => setSearch(text)}
                withCancel
                animated
            />
            <TableView header="Votes">
                {renderElections}
            </TableView>

        </View>

    )
};



export default Votes;
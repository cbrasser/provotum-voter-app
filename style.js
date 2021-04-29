'use strict';
import {
    StyleSheet,
    Platform,
    PlatformColor,
} from 'react-native';


module.exports = StyleSheet.create({
    label: {
        padding: 16,
        ...Platform.select({
            ios: {
                color: PlatformColor('label'),
                backgroundColor:
                    PlatformColor('systemTealColor'),
            },
            android: {
                color: PlatformColor('?android:attr/textColor'),
                backgroundColor:
                    PlatformColor('@android:color/holo_blue_bright'),
            },
            default: { color: 'black' }
        })
    },
    container: {
        flex: 1,
        backgroundColor: PlatformColor('systemBackground')
    },
    centered: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    electionList: {
        flex: 1,
        backgroundColor: PlatformColor('systemBackground')
    },
    electionCard: {
        backgroundColor: PlatformColor('secondarySystemBackground'),
        padding: 25,
        marginBottom: 5,
        flex: 1,
    },
    electionHeader: {}
    ,
    link: {
        color: PlatformColor('link'),
    }
});


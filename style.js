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
    title1: {
        marginTop: 20,
        marginBottom: 15,
    },
    electionInfo: {
        marginBottom: 20,
    },
    container: {
        flex: 1,
        backgroundColor: PlatformColor('systemBackground'),
    },
    textContainer: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    centerinfocontainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    login: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PlatformColor('systemBackground')
    },
    loginView: {
        flex: 0.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    connectedIcon: {
        marginBottom: 10,
    },
    loginText: {
        marginBottom: 100,
    },
    spinner: {
        color: '#467b9d',
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


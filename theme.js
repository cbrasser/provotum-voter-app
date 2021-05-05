import { DefaultTheme, ThemeProvider } from 'react-native-ios-kit';
import color from 'color';
import {
    PlatformColor,
} from 'react-native';

export default theme = {
    ...DefaultTheme,
    primaryColor: '#BF616A',
    disabledColor: '#EBCB8B',
    backgroundColor: PlatformColor('systemBackground'),
    barColor: PlatformColor('systemBackground')
};

/*
Options:
    primaryColor: string,
    primaryLightColor: string,
    disabledColor: string,
    backgroundColor: string,
    barColor: string,
    dividerColor: string,
    textColor: string,
    placeholderColor: string,
    footnoteColor: string,
    footnoteBackgroundColor: string,
    positiveColor: string,
*/
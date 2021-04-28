/**
 * @format
 */

import { AppRegistry } from 'react-native';

import globals from "./globals";

import App from './App';
import { name as appName } from './app.json';
import 'react-native-get-random-values'

AppRegistry.registerComponent(appName, () => App);

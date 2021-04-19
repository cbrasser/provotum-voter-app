/**
 * @format
 */

import { AppRegistry } from 'react-native';
import globals from "./globals";

import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

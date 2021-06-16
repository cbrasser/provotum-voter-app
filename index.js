/**
 * @format
 */

/*
the import of crypte, shims, and globals must not be changed even if your IDE tells you they
are not used! They are essential and without them the app will not work.
*/

import './shim.js'
import crypto from 'crypto'


import { AppRegistry } from 'react-native';

import globals from "./globals";

import App from './App';
import { name as appName } from './app.json';
import 'react-native-get-random-values'

AppRegistry.registerComponent(appName, () => App);

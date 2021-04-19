//import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type { Node } from 'react';
import {
  StatusBar, SafeAreaView
} from 'react-native';

const styles = require('./style');

import StoreManager from './StoreManager'
import store from './store';
import { Provider } from "react-redux";


const App: () => Node = () => {


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={true ? 'light-content' : 'dark-content'} />
      <Provider store={store}>
        <StoreManager>

        </StoreManager>
      </Provider>
    </SafeAreaView>

  );
};


export default App;

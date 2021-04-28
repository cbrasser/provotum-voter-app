//import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import type { Node } from 'react';
import {
  StatusBar, SafeAreaView
} from 'react-native';
import { TabBar } from 'react-native-ios-kit';


const styles = require('./style');

import StoreManager from './StoreManager'
import store from './store';
import { Provider } from "react-redux";
import { ThemeProvider } from 'react-native-ios-kit';
import theme from './theme';
import { SubstrateContextProvider } from './substrate-lib';


const App: () => Node = () => {

  selectTab = () => { };
  const [activeTab, setactiveTab] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <SubstrateContextProvider>

        <SafeAreaView style={styles.container}>
          <StatusBar barStyle={true ? 'light-content' : 'dark-content'} />
          <Provider store={store}>
            <StoreManager>

            </StoreManager>
          </Provider>
        </SafeAreaView>
        <TabBar
          tabs={[
            {
              title: 'News',
              onPress: selectTab,
              isActive: activeTab === 0,
            },
            {
              title: 'Scores',
              onPress: selectTab,
              isActive: activeTab === 1,
            },
            {
              title: 'Favorites',
              onPress: selectTab,
              isActive: activeTab === 2,
            },
            {
              title: 'Disabled',
              onPress: selectTab,
              isActive: activeTab === 3,
              disabled: true,
            },
          ]}
        />
      </SubstrateContextProvider>

    </ThemeProvider>

  );
};


export default App;

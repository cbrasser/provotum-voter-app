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


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Login from './views/login';
import Votes from './views/votes';
// import StoreManager from './components/StoreManager'
import store from './store';
import { Provider } from "react-redux";

const styles = require('./style');
const Stack = createStackNavigator();



const App: () => Node = () => {


  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: 'Login' }}
          />
          <Stack.Screen name="votes" component={Votes} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};


export default App;

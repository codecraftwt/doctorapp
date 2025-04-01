import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/Navigations/StackNavigation';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import Toast from 'react-native-toast-message'

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
      <StatusBar
          barStyle="light-content" 
          backgroundColor="#127AFb" 
        />
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
        <Toast/>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

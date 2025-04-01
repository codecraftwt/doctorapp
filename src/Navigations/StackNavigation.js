import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../screens/Splash';
import SigninScreen from '../screens/SigninScreen';
import ContactListScreen from '../screens/ContactListScreen';
import ContactFormScreen from '../screens/ContactFormScreen';
import Formview from '../component/Formview';


const Stack = createStackNavigator();

export default function StackNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Signin" component={SigninScreen} />
      <Stack.Screen name="ContactList" component={ContactListScreen}/>
      <Stack.Screen name="ContactForm" component={ContactFormScreen}/>
      <Stack.Screen name="FormView" component={Formview}/>
      

    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})
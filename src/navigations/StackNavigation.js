import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';

import TabNavigation from '../navigations/TabNavigation';
import MovieDetails from '../components/MovieDetails';
import YouTubePlayerScreen from '../screens/YouTubePlayerScreen';
const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MovieDetails" component={MovieDetails} />
      <Stack.Screen name="YouTubePlayerScreen" component={YouTubePlayerScreen} />
      <Stack.Screen name="Tab" component={TabNavigation} />
    </Stack.Navigator>
  );
};

export default StackNavigation;

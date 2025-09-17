import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const SplashScreen = ({ navigation }: { navigation: any }) => {
  
  useEffect(() => {
    const timer = setTimeout(async () => {
      const Token = await AsyncStorage.getItem('jwt_token');
      console.log(Token);
      navigation.replace(Token ? 'Tab' : 'Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* <Image
        source={require('../assets/images/movies-logo.png')}
        style={styles.logoImage}
      /> */}
      <LottieView
        source={require('../assets/animations/Movies title animation.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    color: '#d41c1cff',
    textAlign: 'center',
  },
  logoImage: {
    width: responsiveWidth(33),
    height: responsiveHeight(4),
  },
  animation: {
    width: responsiveWidth(60),
    height: responsiveHeight(20),
  },
});

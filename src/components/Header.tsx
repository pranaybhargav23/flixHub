import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const Header = () => {
  return (
    <View style={styles.header}>
      <Image
        source={require('../assets/images/movies-logo.png')}
        style={styles.logo}
      />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    position: 'absolute', // Make it fixed
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Ensure it stays on top
    backgroundColor: 'rgba(0,0,0,0.8)', // More opaque for visibility
    height: responsiveHeight(8),
    paddingHorizontal: responsiveWidth(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: responsiveWidth(20),
    height: responsiveHeight(4),
    resizeMode: 'contain',
  },
});

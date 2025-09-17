import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';


const LoginScreen = ({ navigation }: { navigation: {replace:(screenName:string) => void}, }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');


  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the user's ID token
      const signInResult = await GoogleSignin.signIn();
      console.log('Google signInResult:', signInResult);

      // Get tokens after sign in
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;
      await AsyncStorage.setItem('token', idToken || '');
      if (!idToken) {
        throw new Error('No ID token found');
      }
      else{
        // Show success toast for Google login
        Toast.show({
          type: 'success',
          text1: '🎉 Google Login Successful',
          text2: 'Welcome to FlixHub! Redirecting...',
          position: 'top',
          visibilityTime: 2000,
        });
        
        // Small delay to show toast before navigation
        setTimeout(() => {
          navigation.replace('Tab');
        }, 1000);
      }

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return signInWithCredential(getAuth(), googleCredential);
    } catch (error) {
      console.error('Google login error:', error);
      Toast.show({
        type: 'error',
        text1: '❌ Google Login Failed',
        text2: 'Something went wrong. Please try again.',
        position: 'top',
        visibilityTime: 3000,
      });
    }

  }

  const onChangeEmail = async (text: string) => {
    await AsyncStorage.setItem('email', text);
    setEmail(text);
  };

  const onChangePassword = async (text: string) => {
    await AsyncStorage.setItem('password', text);
    setPassword(text);
  };
  const onSubmitSucess = (token: string) => {
    AsyncStorage.setItem('jwt_token', token);
    
    // Show success toast for regular login
    Toast.show({
      type: 'success',
      text1: '✅ Login Successful',
      text2: 'Welcome back to FlixHub!',
      position: 'top',
      visibilityTime: 2000,
    });
    
    // Small delay to show toast before navigation
    setTimeout(() => {
      navigation.replace('Tab');
    }, 1000);
  };
  const onSubmitFailure = (errorMessage: string) => {
    setError(true);
    setErrorMessage(errorMessage);
    
    // Show error toast for failed login
    Toast.show({
      type: 'error',
      text1: '❌ Login Failed',
      text2: errorMessage || 'Please check your credentials',
      position: 'top',
      visibilityTime: 3000,
    });
  };
  const onPressButton = async () => {
    // Validate input fields
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: 'error',
        text1: '⚠️ Missing Information',
        text2: 'Please enter both email and password',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      // Show info toast while logging in
      Toast.show({
        type: 'info',
        text1: '🔄 Logging in...',
        text2: 'Please wait while we verify your credentials',
        position: 'top',
        visibilityTime: 2000,
      });

      const url = 'https://apis.ccbp.in/login';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();

      if (data.jwt_token) {
        AsyncStorage.setItem('jwt_token', data.jwt_token);
        onSubmitSucess(data.jwt_token);
      }
      else{
        onSubmitFailure(data.error_msg);
      }
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: '🌐 Network Error',
        text2: 'Please check your internet connection',
        position: 'top',
        visibilityTime: 3000,
      });
    }
    
    setEmail('');
    setPassword('');
  };


  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/movies-logo.png')}
        style={styles.logoImage}
      />
      <View style={styles.loginContainer}>
        <Text style={styles.text}>Login</Text>
        <Text style={styles.label}>USERNAME</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          onChangeText={onChangeEmail}
          value={email}
        />
        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={onChangePassword}
          value={password}
        />
       {error ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={onPressButton}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* OR Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Continue with Google Button */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <View style={styles.googleButtonContent}>
            <Image 
              source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 16,
  },
  loginContainer: {
    flex: 1,
    marginTop: responsiveHeight(8),
  },
  logoImage: {
    width: responsiveWidth(33),
    height: responsiveHeight(4),
    marginTop: responsiveHeight(4),
  },
  text: {
    fontSize: responsiveFontSize(4),
    fontWeight: 'bold',
    color: '#d41c1cff',
    marginVertical: responsiveHeight(2),
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: responsiveHeight(2),
  },
  textInput: {
    height: responsiveHeight(5),
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: responsiveWidth(2),
    marginBottom: responsiveHeight(3),
    color: '#fff',
  },
  button: {
    backgroundColor: '#d41c1cff',
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    marginBottom: responsiveHeight(2),
    fontSize: responsiveFontSize(2),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: responsiveHeight(3),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#888',
  },
  dividerText: {
    color: '#fff',
    marginHorizontal: responsiveWidth(3),
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  googleButtonText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
    

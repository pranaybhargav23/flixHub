import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Header from '../components/Header';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import RazorpayCheckout from 'react-native-razorpay';

const AccountScreen = ({navigation}:{navigation: any}) => {
  const email = AsyncStorage.getItem('email');
  const password = AsyncStorage.getItem('password');

  const onHandleLogout = async () => {
    await AsyncStorage.removeItem('jwt_token');
    navigation.replace('Login');
  };
  const onHandlePayment = () => {
     var options = {
    description: 'Credits towards consultation',
    image: 'https://newcastlepartysales.com/png-transparent-razorpay-logo-tech-companies-thumbnail/?srsltid=AfmBOorX0SNnh1uiEQGo6Ao-QdkS-u3mbtcyz7TzEKgjpQmBkGCT55EV',
    currency: 'INR',
    key: 'rzp_test_RGZKgIIV8m4YHe', // Your api key
    amount: '5000',
    name: 'foo',
    prefill: {
      email: 'void@razorpay.com',
      contact: '9191919191',
      name: 'Razorpay Software'
    },
    theme: {color: '#F37254'}
  }
  RazorpayCheckout.open(options).then((data: { razorpay_payment_id: string }) => {
    // handle success
    Alert.alert('Success', `Success: ${data.razorpay_payment_id}`);
  }).catch((error: any) => {
    // handle failure
    Alert.alert('Error', `Error: ${error.code} | ${error.description}`);
  });
  }
  return (
    <SafeAreaView style={styles.SafeAreaViewBack}>
      <Header />
      <View style={{ marginTop: 90 }}>
        <Text style={styles.accountText}>Account</Text>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Member ship</Text>
          <View style={{ flexDirection: 'column', marginTop: 8 }}>
            <Text style={styles.value}>Username : {email}</Text>
            <Text style={styles.value}>Password : {password}</Text>
          </View>
        </View>
        <View style={styles.divider} />

       
        <View style={styles.row}>
          <Text style={styles.label}>Plan details</Text>
          <View style={{ flexDirection: 'column', marginTop: 8 }}>
            <Text style={styles.value}>Premium</Text>
            <Text style={styles.badge}>Ultra HD</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.button} onPress={onHandleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.button} onPress={onHandlePayment}>
          <Text style={styles.buttonText}>Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  SafeAreaViewBack:{
    flex: 1,
    
  },
  accountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    padding: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 16,
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
  
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  label: {
    color: '#6e7c91',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: responsiveWidth(2),
    padding: 14,
  },
  value: {
    fontSize: 14,
    color: '#000',
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 3,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#e50914',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    alignItems: 'center',
    margin: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

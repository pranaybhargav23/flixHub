import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export const toastConfig = {
  // Custom Success Toast
  success: (props: any) => (
    <TouchableOpacity
      style={{
        height: responsiveHeight(10),
        width: responsiveWidth(90),
        backgroundColor: '#28a745',
        borderRadius: responsiveWidth(3),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(4),
        marginHorizontal: responsiveWidth(5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      onPress={props.onPress}
    >
      <AntDesign name="checkcircle" size={24} color="#fff" />
      <View style={{ marginLeft: responsiveWidth(3), flex: 1 }}>
        <Text style={{
          color: '#fff',
          fontSize: responsiveFontSize(2.2),
          fontWeight: 'bold',
        }}>
          {props.text1}
        </Text>
        {props.text2 && (
          <Text style={{
            color: '#f0f0f0',
            fontSize: responsiveFontSize(1.8),
            marginTop: responsiveHeight(0.5),
          }}>
            {props.text2}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  ),

  // Custom Info Toast
  info: (props: any) => (
    <TouchableOpacity
      style={{
        height: responsiveHeight(10),
        width: responsiveWidth(90),
        backgroundColor: '#479de3ff',
        borderRadius: responsiveWidth(3),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(4),
        marginHorizontal: responsiveWidth(5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      onPress={props.onPress}
    >
      <AntDesign name="infocirlce" size={24} color="#fff" />
      <View style={{ marginLeft: responsiveWidth(3), flex: 1 }}>
        <Text style={{
          color: '#fff',
          fontSize: responsiveFontSize(2.2),
          fontWeight: 'bold',
        }}>
          {props.text1}
        </Text>
        {props.text2 && (
          <Text style={{
            color: '#fff',
            fontSize: responsiveFontSize(1.8),
            marginTop: responsiveHeight(0.5),
          }}>
            {props.text2}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  ),

  // Custom Error Toast
  error: (props: any) => (
    <TouchableOpacity
      style={{
        height: responsiveHeight(10),
        width: responsiveWidth(90),
        backgroundColor: '#dc3545',
        borderRadius: responsiveWidth(3),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(4),
        marginHorizontal: responsiveWidth(5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      onPress={props.onPress}
    >
      <AntDesign name="closecircle" size={24} color="#fff" />
      <View style={{ marginLeft: responsiveWidth(3), flex: 1 }}>
        <Text style={{
          color: '#fff',
          fontSize: responsiveFontSize(2.2),
          fontWeight: 'bold',
        }}>
          {props.text1}
        </Text>
        {props.text2 && (
          <Text style={{
            color: '#f0f0f0',
            fontSize: responsiveFontSize(1.8),
            marginTop: responsiveHeight(0.5),
          }}>
            {props.text2}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  ),

  // Custom Wishlist Toast
  wishlist: (props: any) => (
    <TouchableOpacity
      style={{
        height: responsiveHeight(12),
        width: responsiveWidth(90),
        backgroundColor: '#5bab19ff',
        borderRadius: responsiveWidth(4),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(4),
        marginHorizontal: responsiveWidth(5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#fff',
      }}
      onPress={props.onPress}
    >
      <AntDesign name="heart" size={28} color="#fff" />
      <View style={{ marginLeft: responsiveWidth(4), flex: 1 }}>
        <Text style={{
          color: '#fff',
          fontSize: responsiveFontSize(2.5),
          fontWeight: 'bold',
        }}>
          {props.text1}
        </Text>
        {props.text2 && (
          <Text style={{
            color: '#f8f8f8',
            fontSize: responsiveFontSize(1.9),
            marginTop: responsiveHeight(0.8),
            lineHeight: responsiveHeight(2.5),
          }}>
            {props.text2}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  ),
};

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useFetch from '../hooks/useFetch';

const Fetching = () => {
  const { data, loading, error } = useFetch();

  console.log('Fetched data:', data);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View>
      <Text>Data: {JSON.stringify(data)}</Text>
    </View>
  );
}

export default Fetching

const styles = StyleSheet.create({})
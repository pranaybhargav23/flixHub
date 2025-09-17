import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import YoutubePlayer from "react-native-youtube-iframe";

const HomeYoutube = () => {
  const onChangeState = (state: string) => {
    console.log("Player state changed:", state);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16, backgroundColor: "#000" }}>
      <YoutubePlayer
        height={300}
        play={true}
        videoId={'ybji16u608U'}
        onReady={() => console.log("Ready")}
        onChangeState={onChangeState}
      />
    </View>
  )
}

export default HomeYoutube

const styles = StyleSheet.create({})
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MovieDetails from '../components/MovieDetails';

const ITEM_WIDTH = responsiveWidth(50); // Poster width
const SPACING = 10;

const HomeScreen = ({ navigation }: { navigation: { replace: (screenName: string) => void; navigate: (screenName: string, params?: object) => void } }) => {
  const [trending, setTrending] = useState<{ poster: string; id: string }[]>([]);
  const [originals, setOriginals] = useState<{ poster: string; id: string }[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingOriginals, setLoadingOriginals] = useState(true);

  const onHandleProps = (id: string) => {
    navigation.navigate('MovieDetails', { movieId: id });
  };
  const onHandleVideo = (movieId: string) => {
    navigation.navigate('YouTubePlayerScreen', { movieId });
  };
  const renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.header}>Super Man</Text>
          <Text style={styles.description}>
            Superman is a fictional superhero who first appeared in American
            Comics books published by DC Comics.
          </Text>
          <TouchableOpacity style={styles.playButtonContainer} onPress={() => onHandleVideo('a9f97e39-c6a8-4e01-ad3c-56d5b09d1107')}>
            <Text style={styles.playButton}>Play</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderOriginals = () => {
    return (
      <View>
        <Text style={styles.trendingText}>Originals</Text>
        {loadingOriginals ? (
          <ActivityIndicator size="large" color="#FA4A0C" />
        ) : (
          <FlatList
            data={originals}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SPACING }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onHandleProps(item.id)}>
                <View
                  style={{
                    marginHorizontal: SPACING,
                    borderRadius: 15,
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={{ uri: item.poster }}
                    style={styles.posterImage}
                    resizeMode="cover"
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  };

  const renderTrending = () => {
    return (
      <View style={styles.trendingContainer}>
        <Text style={styles.trendingText}>Trending Movies</Text>
        {loadingTrending ? (
          <ActivityIndicator size="large" color="#FA4A0C" />
        ) : (
          <FlatList
            data={trending}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SPACING }}
            renderItem={({ item }) => (
             <TouchableOpacity 
              onPress={() => onHandleProps(item.id)}
             >
               <View
                style={{
                  marginHorizontal: SPACING,
                  borderRadius: 15,
                  overflow: 'hidden',
                }}
                
              >
                <Image
                  source={{ uri: item.poster }}
                  style={styles.posterImage}
                  resizeMode="cover"
                />
              </View>
             </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  };

  const fetchingTrendingData = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const url = 'https://apis.ccbp.in/movies-app/trending-movies';
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Failed to fetch trending');
      const data = await response.json();
      console.log(data);
      const moviesData = data.results.map(
        (eachMovie: { poster_path: string; id: string }) => ({
          id: eachMovie.id,
          poster: eachMovie.poster_path,
        }),
      );
      console.log(moviesData.map((movie: { id: string; poster: string }) => movie.id));

      setTrending(moviesData);
    } catch (error) {
      console.error('Error fetching trending data:', error);
    } finally {
      setLoadingTrending(false);
    }
  };

  const fetchingOriginalsData = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const url = 'https://apis.ccbp.in/movies-app/originals';
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Failed to fetch originals');
      const data = await response.json();

      const originalsData = data.results.map(
        (eachMovie: { poster_path: string; id: number }) => ({
          id: eachMovie.id,
          poster: eachMovie.poster_path,
        }),
      );

      setOriginals(originalsData);
    } catch (error) {
      console.error('Error fetching originals data:', error);
    } finally {
      setLoadingOriginals(false);
    }
  };

  useEffect(() => {
    fetchingTrendingData();
    fetchingOriginalsData();
  }, []);

  return (
    <ScrollView>
      <SafeAreaView style={styles.backgroundContainer}>
        <ImageBackground
          source={require('../assets/images/background-img.png')}
          style={styles.backgroundImage}
        >
          <Header />
          {renderContent()}
        </ImageBackground>

        {renderTrending()}
        {renderOriginals()}
      </SafeAreaView>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: responsiveFontSize(5),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: responsiveHeight(1),
  },
  description: {
    fontSize: responsiveFontSize(2),
    maxWidth: responsiveWidth(80),
    lineHeight: responsiveHeight(3),
    color: '#fff',
    marginBottom: responsiveHeight(3),
    fontFamily: 'Roboto_SemiCondensed-Italic',
  },
  playButtonContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
    width: responsiveWidth(18),
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
  },
  playButton: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  posterImage: {
    width: ITEM_WIDTH,
    height: responsiveHeight(30),
    borderRadius: 10,
  },
  trendingText: {
    color: '#fff',
    fontSize: responsiveFontSize(3),
    margin: responsiveHeight(2),
    marginBottom: responsiveHeight(3),
    fontWeight: 'bold',
  },
  trendingContainer: {
    marginVertical: responsiveHeight(2),
  },
});

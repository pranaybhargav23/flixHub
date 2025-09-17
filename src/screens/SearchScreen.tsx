import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchScreen = ({ navigation }: { navigation: any }) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchResults, setSearchResults] = useState<
    { id: string; title: string; posterPath: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const onHandleProps = (id: string) => {
    console.log(id);
    navigation.navigate('MovieDetails', { movieId: id });
  };

  // Move fetchMovies outside useEffect to make it reusable
  const fetchMovies = async (searchTerm?: string) => {
    setLoading(true);
    const token = await AsyncStorage.getItem('jwt_token');
    let url = 'https://apis.ccbp.in/movies-app/movies-search?search=';
    if (searchTerm && searchTerm.trim().length > 0) {
      url += encodeURIComponent(searchTerm);
    }
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      const movies = data.results.map(
        (movie: { id: string; title: string; poster_path: string }) => ({
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
        }),
      );
      setSearchResults(movies);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchInput.trim().length > 0) {
      fetchMovies(searchInput);
    } else {
      fetchMovies(); // fetch all movies when input is empty
    }
  }, [searchInput]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/movies-logo.png')}
          style={styles.logo}
        />
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Movies"
            placeholderTextColor="#130d0dff"
            onChangeText={text => setSearchInput(text)}
            value={searchInput}
          />
          <Ionicons
            name="search"
            size={20}
            color="#100f0fff"
            style={styles.searchIcon}
          />
        </View>
      </View>
      
      <View style={styles.listLabelContainer}>
        <Text style={styles.listLabel}>Movie List</Text>
      </View>
      <ScrollView style={styles.listContainer}>
        {loading ? (
          // Show loading placeholders that match movie item layout
          <>
            {[1, 2, 3, 4, 5,6,7,8].map(i => (
              <View style={styles.movieItem} key={i}>
                <View style={[styles.moviePoster, styles.loadingPoster]} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.loadingTitle} />
                </View>
              </View>
            ))}
          </>
        ) : searchResults.length === 0 && searchInput.trim().length > 0 ? (
          <View style={styles.notFoundContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={40}
              color="#ef0c0cff"
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.notFoundText}>Movie not found</Text>
          </View>
        ) : (
          searchResults.map(movie => (
            <TouchableOpacity onPress={() => onHandleProps(movie.id)} key={movie.id}>
              <View style={styles.movieItem}>
                <Image
                  source={{ uri: movie.posterPath }}
                  style={styles.moviePoster}
                />
                <Text style={styles.movieTitle}>{movie.title}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  notFoundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(5),
  },
  notFoundText: {
    fontSize: responsiveFontSize(2.5),
    color: '#ef0c0cff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#070404ff',
    // paddingTop: responsiveHeight(2),
  },
  header: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    height: responsiveHeight(8),
    paddingHorizontal: responsiveWidth(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  logo: {
    width: responsiveWidth(20),
    height: responsiveHeight(4),
    resizeMode: 'contain',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5d3d3ff',
    borderRadius: 8,
    paddingHorizontal: 8,
    width: responsiveWidth(55),
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: responsiveFontSize(2),
    color: '#140e0eff',
    paddingVertical: 4,
  },
  listLabelContainer: {
    paddingHorizontal: responsiveWidth(4),
    marginTop: responsiveHeight(2),
    backgroundColor: '#070404ff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  listLabel: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(1),
    color: '#ef0c0cff',
  },
  listContainer: {
    paddingHorizontal: responsiveWidth(4),
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  moviePoster: {
    width: 50,
    height: 75,
    borderRadius: 4,
    marginRight: 12,
  },
  movieTitle: {
    fontSize: responsiveFontSize(2),
    color: '#f5e7e7ff',
  },
  loadingPoster: {
    backgroundColor: '#333',
  },
  loadingTitle: {
    height: 20,
    borderRadius: 6,
    marginTop: 12,
    width: '60%',
    backgroundColor: '#333',
  },
  //   logo: {
  //     width: responsiveWidth(20),
  //     height: responsiveHeight(4),
  //     resizeMode: 'contain',
  //   },
  //   searchContainer: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     backgroundColor: '#e5d3d3ff',
  //     borderRadius: 8,
  //     paddingHorizontal: 8,
  //     width: responsiveWidth(55),
  //   },
  //   searchIcon: {
  //     marginRight: 6,
  //   },
  //   searchInput: {
  //     flex: 1,
  //     fontSize: responsiveFontSize(2),
  //     color: '#140e0eff',
  //     paddingVertical: 4,
  //   },
  //   listContainer: {
  //     marginTop: responsiveHeight(2),
  //     paddingHorizontal: responsiveWidth(4),
  //   },
  //   listLabel: {
  //     fontSize: responsiveFontSize(2.5),
  //     fontWeight: 'bold',
  //     marginBottom: responsiveHeight(1),
  //     paddingHorizontal: responsiveWidth(4),
  //     color: '#ef0c0cff',
  //     position: 'relative',
  //     top: 0,
  //     left: 0,
  //     right: 0,
  //     zIndex: 1000,
  //   },
  //   movieItem: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     marginVertical: 8,
  //   },
});

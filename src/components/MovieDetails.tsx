import { ActivityIndicator, Button, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect,useState } from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../utils/toastConfig';
import YouTubePlayerScreen from '../screens/YouTubePlayerScreen';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '../store/wishlistSlice';
import { saveWishlistAfterChange } from '../store/wishlistActions';


const MovieDetails = () => {
    const [movieDetails, setMovieDetails] = useState<{
      id: string;
      title: string;
      overview: string;
      release_date: string;
      poster_path: string;
      runtime: number;
      genres: string[];
      audioAvailable: string[];
      ratingCount: number;
      ratingAverage: number;
      budget: number;
      releaseDate: string;
      moreLike: { poster: string; id: string }[]; // <-- Change type here
      similarMovies: string[]; // <-- Add this line
    }>({
      id: '',
      title: '',
      overview: '',
      release_date: '',
      poster_path: '',
      runtime: 0,
      genres: [],
      audioAvailable: [],
      ratingCount: 0,
      ratingAverage: 0,
      budget: 0,
      releaseDate: '',
      moreLike: [], // <-- No change needed here
      similarMovies: [], // <-- Add this line
    });
    const [loading, setLoading] = useState<boolean>(false);

  // Redux hooks
  const dispatch = useAppDispatch();
  const isInWishlist = useAppSelector(selectIsInWishlist(movieDetails.id));

  const route = useRoute();
  const navigation = useNavigation<any>();
  const { movieId } = (route.params as { movieId: string });

  const fetchingData = async (newMovieId?: string) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('jwt_token');
      const currentMovieId = newMovieId || movieId;
      const url = `https://apis.ccbp.in/movies-app/movies/${currentMovieId}`;
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data,"abcdefrghhjlashndjlanhsjldasdas------>");
      const formattedData = {
        id: data.movie_details.id,
        title: data.movie_details.title,
        overview: data.movie_details.overview,
        release_date: data.movie_details.release_date,
        poster_path: data.movie_details.poster_path,
        runtime: data.movie_details.runtime,
        genres: data.movie_details.genres?.map((genre: { name: string }) => genre.name) || [],
        audioAvailable: data.movie_details.spoken_languages?.map((language: { english_name: string }) => language.english_name) || [],
        ratingCount: data.movie_details.vote_count,
        ratingAverage: data.movie_details.vote_average,
        budget: data.movie_details.budget,
        releaseDate: data.movie_details.release_date,
        moreLike: data.movie_details.similar_movies?.map((movie: { poster_path: string, id: string }) => ({ poster: movie.poster_path, id: movie.id })) || [],
        similarMovies: data.movie_details.similar_movies?.map((movie: { id: string }) => movie.id) || [], // <-- Add this line
      };
      console.log("geeeee",formattedData.audioAvailable);
      console.log(formattedData,"abcdefghijklmn");
      setMovieDetails(formattedData);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }finally{
      setLoading(false);
    }
  };

  const handleMoreLikePress = (newMovieId: string) => {
    console.log('Fetching details for movie ID:', newMovieId);
    fetchingData(newMovieId);
  };
  const onPressPlay = (id: string) => {
    navigation.navigate('YouTubePlayerScreen', { movieId: id });
  };


  const handleWishlistToggle = () => {
    const newWishlistState = !isInWishlist;
    
    // Show toast notification
    if (newWishlistState) {
      // Add to wishlist using Redux
      const movieToAdd = {
        id: movieDetails.id,
        title: movieDetails.title,
        overview: movieDetails.overview,
        release_date: movieDetails.release_date,
        poster_path: movieDetails.poster_path,
        runtime: movieDetails.runtime,
        genres: movieDetails.genres,
        ratingAverage: movieDetails.ratingAverage,
        ratingCount: movieDetails.ratingCount,
        budget: movieDetails.budget,
      };
      
      dispatch(addToWishlist(movieToAdd));
      
      Toast.show({
        type: 'wishlist', // Using custom wishlist type
        text1: '❤️ Added to Wishlist',
        text2: `${movieDetails.title} is now in your favorites!`,
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
        swipeable: true,
        onPress: () => {
          console.log('Toast pressed - navigate to wishlist?');
          Toast.hide();
        }
      });
    } else {
      // Remove from wishlist using Redux
      dispatch(removeFromWishlist(movieDetails.id));
      
      Toast.show({
        type: 'info',
        text1: '💔 Removed from Wishlist',
        text2: `${movieDetails.title} has been removed`,
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
        swipeable: true,
        text1Style: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#fff'
        },
        text2Style: {
          fontSize: 14,
          color: '#f0f0f0'
        }
      });
    }
    
    // Here you can add logic to save/remove from wishlist in AsyncStorage or API
    console.log(newWishlistState ? 'Added to wishlist' : 'Removed from wishlist');
  };

  useEffect(() => {
    fetchingData();
    
  }, []);

  return (
    <>
    <ScrollView>
      <View style={{ flex: 1 }}>
        {loading && <ActivityIndicator  style={{position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -50 }, { translateY: -50 }]}} size="large" color="#e81616ff" />}
      <ImageBackground
        source={{ uri: movieDetails.poster_path }}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        {/* <Header /> */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
          >
            <Image
               source={require('../assets/images/movies-logo.png')}
               style={styles.logo}
               
             />
          </TouchableOpacity>
             
           </View>
        
        <View style={styles.wholeContainer}>
            <View style={{ alignItems: 'flex-start', paddingHorizontal: 16 }}>
                <Text style={styles.title}>{movieDetails.title}</Text>
                <View style={styles.detailsContainer}>
                    <Text style={styles.runtime}>{movieDetails.runtime} mins</Text>
                    <TouchableOpacity style={styles.ageRatingButton}>
                        <Text style={styles.ageRatingText}>U/A</Text>
                    </TouchableOpacity>
                    <Text style={styles.releaseDate}>
                      {movieDetails.release_date ? movieDetails.release_date.slice(0, 4) : ''} 
                    </Text>
                </View>
                <Text style={styles.overview}>{movieDetails.overview}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.watchButton} onPress={() => onPressPlay(movieDetails.id)}>
                        <Text style={styles.watchButtonText}>Play</Text>
                    </TouchableOpacity>
                   <TouchableOpacity style={styles.wishlistButton} onPress={handleWishlistToggle}>
                        <AntDesign 
                            name={isInWishlist ? "heart" : "hearto"} 
                            size={24} 
                            color={isInWishlist ? "#e81616ff" : "#ffffff"} 
                        />
                   </TouchableOpacity>
                </View>
            </View>
        </View>
      </ImageBackground>
     </View>
    <View style={styles.bottomContainer}>
      <View style={styles.adjustContainer}>
        <View style={styles.genresContainer}>
             <Text style={styles.genresTitle}>Genres</Text>
             {movieDetails.genres.map((genre: string, index: number) => ( // <-- add type annotation
               <Text style={styles.genre} key={index}>{genre}</Text>
             ))}
        </View>
         <View style={styles.genresContainer}>
             <Text style={styles.genresTitle}>Audio</Text>
             {movieDetails.audioAvailable.map((audio: string, index: number) => ( // <-- add type annotation
               <Text style={styles.genre} key={index}>{audio}</Text>
             ))}
        </View>
         <View style={styles.genresContainer}>
          <View>
              <Text style={styles.genresTitle}>Rating Count</Text>
              <Text style={styles.genre}>{movieDetails.ratingCount}</Text>

          </View>
          <View>
              <Text style={styles.genresTitle}>Rating Average</Text>
              <Text style={styles.genre}>{movieDetails.ratingAverage}</Text>

          </View>
           
             
        </View>
      </View>
     <View style={styles.budgetContainer}>
       <View style={styles.budgetContentContainer}>
              <Text style={styles.genresTitle}>Budget</Text>
              <Text style={styles.genre}>{movieDetails.budget}</Text>

          </View>
          <View>
              <Text style={styles.genresTitle}>Release Date</Text>
              <Text style={styles.genre}>{movieDetails.release_date}</Text>

          </View>
     </View>
       <View style={styles.moreLikeContainer}>
         <Text style={styles.moreLikeTitle}>More Like This</Text>
         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
           {movieDetails.moreLike.map(
             (
               item: { poster: string; id: string },
               index: number
             ) => (
               <TouchableOpacity
                 key={item.id}
                 onPress={() => handleMoreLikePress(item.id)}
               >
                 <Image source={{ uri: item.poster }} style={styles.moreLike} />
               </TouchableOpacity>
             )
           )}
         </ScrollView>
       </View>
    </View>
    </ScrollView>
    </>

  );
};

export default MovieDetails;

const styles = StyleSheet.create({
  imageBackground: {
     flex: 1,
    height: responsiveHeight(100),
    width: responsiveWidth(100),
  },
  wholeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: responsiveHeight(20),
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  title: {
    fontSize: responsiveFontSize(3.5),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: responsiveHeight(1),
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  runtime: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    marginRight: responsiveWidth(2.5),
  },
  ageRatingButton: {
    backgroundColor: '#222',
    borderRadius: responsiveWidth(1.5),
    paddingHorizontal: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(0.5),
    marginRight: responsiveWidth(2.5),
  },
  ageRatingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
  releaseDate: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
  },
  overview: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontFamily:'Roboto_SemiCondensed-Italic',
    marginVertical: responsiveHeight(1.2),
    lineHeight: responsiveHeight(2.8),
    maxWidth: '90%',
  },
  buttonContainer: {
    marginVertical: responsiveHeight(1.5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetContentContainer:{
    marginRight:responsiveHeight(2),
  },
  watchButton: {
    backgroundColor: '#ebeef5ff',
    borderRadius: responsiveWidth(2),
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(8),
    alignSelf: 'flex-start',
  },
  watchButtonText: {
    color: '#0e0101ff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  wishlistButton: {
    marginLeft: responsiveWidth(4),
    padding: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer:{
    flex: 1,
    backgroundColor: '#222',
  },
  adjustContainer:{
    flexDirection: 'row',
    padding: responsiveWidth(4),
  },
  budgetContainer: {
     flexDirection: 'row',
    paddingLeft: responsiveWidth(4),
  },

  genresContainer: {
    flex: 1,
    marginRight: responsiveWidth(4),
  },
  genresTitle: {
    color: '#64748B',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveHeight(1),
  },
  moreLikeTitle:{
    color: '#ef0b0bff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(3),
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(1),
  },
  genre: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    marginBottom: responsiveHeight(1),
  },
  moreLike: {
    width: responsiveWidth(25),
    height: responsiveHeight(18),
    borderRadius: responsiveWidth(2),
    marginHorizontal: responsiveWidth(2.5),
  },
   header: {
    position: 'absolute', // Make it fixed
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Ensure it stays on top
    backgroundColor: 'rgba(0,0,0,0.2)', // More opaque for visibility
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
  
  moreLikeContainer: {
    marginBottom: responsiveHeight(3),
  },
 
});

import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect } from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  selectWishlistItems, 
  selectWishlistCount, 
  removeFromWishlist,
  clearWishlist 
} from '../store/wishlistSlice';
import { loadWishlistFromStorage } from '../store/wishlistActions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const WishlistScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const wishlistItems = useAppSelector(selectWishlistItems);
  const wishlistCount = useAppSelector(selectWishlistCount);

  useEffect(() => {
    // Load wishlist from storage when component mounts
    dispatch(loadWishlistFromStorage());
  }, [dispatch]);

  const handleRemoveFromWishlist = (movieId: string, movieTitle: string) => {
    Alert.alert(
      'Remove from Wishlist',
      `Remove "${movieTitle}" from your wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dispatch(removeFromWishlist(movieId));
            Toast.show({
              type: 'info',
              text1: 'Removed from Wishlist',
              text2: `${movieTitle} has been removed`,
              position: 'top',
              visibilityTime: 2000,
            });
          },
        },
      ]
    );
  };

  const handleClearWishlist = () => {
    Alert.alert(
      'Clear Wishlist',
      'Remove all movies from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            dispatch(clearWishlist());
            Toast.show({
              type: 'info',
              text1: 'Wishlist Cleared',
              text2: 'All movies have been removed',
              position: 'top',
              visibilityTime: 2000,
            });
          },
        },
      ]
    );
  };

  const handleMoviePress = (movieId: string) => {
    navigation.navigate('MovieDetails', { movieId });
  };

  const renderMovieItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.movieCard}
      onPress={() => handleMoviePress(item.id)}
    >
      <Image source={{ uri: item.poster_path }} style={styles.posterImage} />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.movieYear}>
          {item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}
        </Text>
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>
            {item.ratingAverage ? item.ratingAverage.toFixed(1) : 'N/A'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFromWishlist(item.id, item.title)}
      >
        <AntDesign name="close" size={20} color="#e81616ff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (wishlistItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <AntDesign name="heart" size={80} color="#666" />
        <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
        <Text style={styles.emptySubtitle}>
          Add movies to your wishlist to see them here
        </Text>
        <TouchableOpacity 
          style={styles.browseButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.browseButtonText}>Browse Movies</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <Text style={styles.movieCount}>{wishlistCount} movies</Text>
        {wishlistCount > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearWishlist}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item.id}
        renderItem={renderMovieItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
  },
  movieCount: {
    color: '#888',
    fontSize: responsiveFontSize(1.8),
  },
  clearButton: {
    backgroundColor: '#e81616ff',
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.8),
    borderRadius: responsiveWidth(2),
  },
  clearButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
  },
  listContainer: {
    padding: responsiveWidth(4),
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: responsiveWidth(3),
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(2),
    alignItems: 'center',
  },
  posterImage: {
    width: responsiveWidth(20),
    height: responsiveHeight(12),
    borderRadius: responsiveWidth(2),
  },
  movieInfo: {
    flex: 1,
    marginLeft: responsiveWidth(3),
  },
  movieTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(0.5),
  },
  movieYear: {
    color: '#888',
    fontSize: responsiveFontSize(1.8),
    marginBottom: responsiveHeight(0.5),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#FFD700',
    fontSize: responsiveFontSize(1.8),
    marginLeft: responsiveWidth(1),
    fontWeight: 'bold',
  },
  removeButton: {
    padding: responsiveWidth(2),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
    paddingHorizontal: responsiveWidth(8),
  },
  emptyTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(1),
  },
  emptySubtitle: {
    color: '#888',
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    marginBottom: responsiveHeight(4),
  },
  browseButton: {
    backgroundColor: '#e81616ff',
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveHeight(1.5),
    borderRadius: responsiveWidth(3),
  },
  browseButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },
});
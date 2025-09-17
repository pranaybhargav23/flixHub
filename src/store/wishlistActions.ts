import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Movie } from './wishlistSlice';

const WISHLIST_STORAGE_KEY = 'wishlist_movies';

// Async thunk to save wishlist to AsyncStorage
export const saveWishlistToStorage = createAsyncThunk(
  'wishlist/saveToStorage',
  async (wishlist: Movie[], { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      return wishlist;
    } catch (error) {
      return rejectWithValue('Failed to save wishlist to storage');
    }
  }
);

// Async thunk to load wishlist from AsyncStorage
export const loadWishlistFromStorage = createAsyncThunk(
  'wishlist/loadFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const wishlistData = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
      if (wishlistData) {
        return JSON.parse(wishlistData) as Movie[];
      }
      return [];
    } catch (error) {
      return rejectWithValue('Failed to load wishlist from storage');
    }
  }
);

// Helper function to save wishlist after each change
export const saveWishlistAfterChange = (wishlist: Movie[]) => {
  AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist)).catch(
    error => console.error('Failed to save wishlist:', error)
  );
};

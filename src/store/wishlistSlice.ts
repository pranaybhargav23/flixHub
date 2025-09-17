import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadWishlistFromStorage, saveWishlistToStorage } from './wishlistActions';

// Define the movie interface
export interface Movie {
  id: string;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  runtime?: number;
  genres?: string[];
  ratingAverage?: number;
  ratingCount?: number;
  budget?: number;
}

// Define the initial state interface
interface WishlistState {
  items: Movie[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// Create the wishlist slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Add movie to wishlist
    addToWishlist: (state, action: PayloadAction<Movie>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (!existingItem) {
        state.items.push(action.payload);
        state.error = null;
      }
    },
    
    // Remove movie from wishlist
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.error = null;
    },
    
    // Clear entire wishlist
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle async actions
    builder
      .addCase(loadWishlistFromStorage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadWishlistFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(loadWishlistFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveWishlistToStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveWishlistToStorage.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(saveWishlistToStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setLoading,
  setError,
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.items;
export const selectWishlistLoading = (state: { wishlist: WishlistState }) => state.wishlist.loading;
export const selectWishlistError = (state: { wishlist: WishlistState }) => state.wishlist.error;
export const selectIsInWishlist = (movieId: string) => (state: { wishlist: WishlistState }) => 
  state.wishlist.items.some(item => item.id === movieId);
export const selectWishlistCount = (state: { wishlist: WishlistState }) => state.wishlist.items.length;

// Export reducer
export default wishlistSlice.reducer;

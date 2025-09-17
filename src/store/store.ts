import { configureStore, Middleware } from '@reduxjs/toolkit';
import wishlistReducer from './wishlistSlice';
import { saveWishlistAfterChange } from './wishlistActions';

// Middleware to save wishlist to AsyncStorage after each change
const wishlistPersistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Save to AsyncStorage after wishlist actions
  if (
    typeof action === 'object' && 
    action !== null && 
    'type' in action &&
    (action.type === 'wishlist/addToWishlist' ||
     action.type === 'wishlist/removeFromWishlist' ||
     action.type === 'wishlist/clearWishlist')
  ) {
    const state = store.getState();
    saveWishlistAfterChange(state.wishlist.items);
  }
  
  return result;
};

// Configure the Redux store
export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(wishlistPersistenceMiddleware),
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

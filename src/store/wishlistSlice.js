import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import wishlistService from '../lib/wishlistService';

// Async thunk for fetching wishlist
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const user = state.auth.user;
    if (!user?.$id) throw new Error('User not authenticated');

    try {
      const res = await wishlistService.getWishlist();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for toggling wishlist
export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId, { rejectWithValue, getState }) => {
    const state = getState();
    const user = state.auth.user;
    if (!user?.$id) throw new Error('User not authenticated');

    try {
      const updatedWishlist = await wishlistService.toggleWishlist(productId);
      return updatedWishlist;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [], // Array of productIds
    loading: false,
    error: null,
    loaded: false, // Cache flag
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.loaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.loaded = true;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

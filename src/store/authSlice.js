import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setUser } from "./cartSlice";
import { account } from "../lib/appwrite";
import service from "../lib/appwrite";
import authService from "../lib/auth";

const initialState = {
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  banned: false,
  loading: true,
};

// Async thunk to check auth on app load
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const authUser = await account.get();
      const userDoc = await service.getUserByUserId(authUser.$id);
      return { ...authUser, userDoc };
    } catch (error) {
      if (error.code === 401) {
        dispatch({ type: 'auth/sessionExpired' });
      }
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await authService.login(email, password);
      const authUser = await account.get();
      const userDoc = await service.getUserByUserId(authUser.$id);
      return { ...authUser, userDoc };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    await authService.logout();
    // Clear all related states
    dispatch({ type: 'cart/clearCart' });
    dispatch({ type: 'wishlist/clearWishlist' });
    dispatch({ type: 'checkout/clearAddress' });
    return true;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const user = action.payload.user;

      state.isAuthenticated = true;
      state.user = user;
      state.loading = false;

      // ✅ ROLE & FLAGS SHOULD COME FROM BACKEND
      state.isAdmin = user?.userDoc?.role === "admin" || user?.prefs?.role === "admin";
      state.banned = user?.userDoc?.isBanned === true || user?.prefs?.banned === true;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isAdmin = false;
      state.banned = false;
      state.loading = false;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    sessionExpired: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isAdmin = false;
      state.banned = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        const user = action.payload;
        state.isAuthenticated = true;
        state.user = user;
        state.loading = false;
        state.isAdmin = user?.userDoc?.role === "admin" || user?.prefs?.role === "admin";
        state.banned = user?.userDoc?.isBanned === true || user?.prefs?.banned === true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isAdmin = false;
        state.banned = false;
        state.loading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const user = action.payload;
        state.isAuthenticated = true;
        state.user = user;
        state.loading = false;
        state.isAdmin = user?.userDoc?.role === "admin" || user?.prefs?.role === "admin";
        state.banned = user?.userDoc?.isBanned === true || user?.prefs?.banned === true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isAdmin = false;
        state.banned = false;
        state.loading = false;
      });
  },
});

export const { login, logout, setLoading, sessionExpired } = authSlice.actions;
export default authSlice.reducer;

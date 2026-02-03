import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../lib/authService";
import userService from "../lib/userService";

const initialState = {
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  banned: false,
  loading: false,
  error: null,
  bootstrapped: false,
};

const applyUserState = (state, user) => {
  state.isAuthenticated = Boolean(user);
  state.user = user;
  state.isAdmin = user?.role === "admin" || user?.userDoc?.role === "admin";
  state.banned = user?.isBanned === true || user?.userDoc?.isBanned === true;
};

export const bootstrapSession = createAsyncThunk(
  "auth/bootstrapSession",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getSession();
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithPassword = createAsyncThunk(
  "auth/loginWithPassword",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async ({ idToken }, { rejectWithValue }) => {
    try {
      const data = await authService.googleLogin(idToken);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerWithPassword = createAsyncThunk(
  "auth/registerWithPassword",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.register(name, email, password);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getMe();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await authService.logout();
      dispatch({ type: "cart/clearCart" });
      dispatch({ type: "wishlist/clearWishlist" });
      dispatch({ type: "checkout/clearAddress" });
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutAllUser = createAsyncThunk(
  "auth/logoutAllUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await authService.logoutAll();
      dispatch({ type: "cart/clearCart" });
      dispatch({ type: "wishlist/clearWishlist" });
      dispatch({ type: "checkout/clearAddress" });
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bootstrapSession.fulfilled, (state, action) => {
        state.loading = false;
        state.bootstrapped = true;
        applyUserState(state, action.payload);
      })
      .addCase(bootstrapSession.rejected, (state, action) => {
        state.loading = false;
        state.bootstrapped = true;
        state.error = action.payload;
        applyUserState(state, null);
      })
      .addCase(loginWithPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.loading = false;
        applyUserState(state, action.payload);
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        applyUserState(state, null);
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        applyUserState(state, action.payload);
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        applyUserState(state, null);
      })
      .addCase(registerWithPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerWithPassword.fulfilled, (state, action) => {
        state.loading = false;
        applyUserState(state, action.payload);
      })
      .addCase(registerWithPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = action.payload;
          state.isAdmin = action.payload?.role === "admin";
          state.banned = action.payload?.isBanned === true;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        applyUserState(state, null);
      })
      .addCase(logoutAllUser.fulfilled, (state) => {
        state.loading = false;
        applyUserState(state, null);
      });
  },
});

export const { setLoading } = authSlice.actions;
export default authSlice.reducer;

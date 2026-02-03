import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../lib/userService';

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    if (state.users.users.length > 0) {
      // Already loaded, return existing
      return state.users.users;
    }
    try {
      return await userService.getUsers({});
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for banning a user
export const banUser = createAsyncThunk(
  'users/banUser',
  async ({ userId, banReason }, { rejectWithValue, getState }) => {
    try {
      return await userService.banUser(userId, banReason);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for unbanning a user
export const unbanUser = createAsyncThunk(
  'users/unbanUser',
  async (userId, { rejectWithValue, getState }) => {
    try {
      return await userService.unbanUser(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating user role
export const updateUserRole = createAsyncThunk(
  'users/updateUserRole',
  async ({ userId, role }, { rejectWithValue, getState }) => {
    try {
      return await userService.updateUserRole(userId, role);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating user status
export const updateUserStatus = createAsyncThunk(
  'users/updateUserStatus',
  async ({ userId, isActive }, { rejectWithValue, getState }) => {
    try {
      return await userService.updateUserStatus(userId, isActive);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(banUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(banUser.fulfilled, (state) => {
        state.loading = false;
        // Optionally update user in state
      })
      .addCase(banUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(unbanUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unbanUser.fulfilled, (state) => {
        state.loading = false;
        // Optionally update user in state
      })
      .addCase(unbanUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;

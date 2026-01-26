import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases } from '../lib/appwrite';

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID
      );
      return response.documents;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for banning a user
export const banUser = createAsyncThunk(
  'users/banUser',
  async (userId, { rejectWithValue }) => {
    try {
      const updatedUser = await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
        userId,
        { banned: true }
      );
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for unbanning a user
export const unbanUser = createAsyncThunk(
  'users/unbanUser',
  async (userId, { rejectWithValue }) => {
    try {
      const updatedUser = await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
        userId,
        { banned: false }
      );
      return updatedUser;
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
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;

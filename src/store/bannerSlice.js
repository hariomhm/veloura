import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, storage, ID } from '../lib/appwrite';

// Async thunk for fetching banners
export const fetchBanners = createAsyncThunk(
  'banners/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_BANNERS_COLLECTION_ID
      );
      return response.documents;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating a banner
export const updateBanner = createAsyncThunk(
  'banners/updateBanner',
  async ({ bannerId, bannerData }, { rejectWithValue }) => {
    try {
      const { image, link } = bannerData;

      let imageId = null;
      if (image && image instanceof File) {
        // Upload new image
        const response = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          ID.unique(),
          image
        );
        imageId = response.$id;
      }

      const updateData = {};
      if (link !== undefined) updateData.link = link;
      if (imageId) updateData.image = imageId;

      const updatedBanner = await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_BANNERS_COLLECTION_ID,
        bannerId,
        updateData
      );

      return updatedBanner;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bannerSlice = createSlice({
  name: 'banners',
  initialState: {
    banners: [],
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
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        // Process images to get download URLs
        const processedBanners = action.payload.map(banner => {
          const imageUrl = banner.image ? storage.getFileView(import.meta.env.VITE_APPWRITE_BUCKET_ID, banner.image) : null;
          return {
            ...banner,
            imageUrl,
          };
        });
        state.banners = processedBanners;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state) => {
        state.loading = false;
        // Optionally refetch banners or update state
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = bannerSlice.actions;
export default bannerSlice.reducer;

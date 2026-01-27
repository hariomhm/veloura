import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../config.js";
import { databases, storage, ID } from "../lib/appwrite";

/* ---------------- FETCH BANNERS ---------------- */

export const fetchBanners = createAsyncThunk(
  "banners/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteBannersCollectionId
      );

      return response.documents;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ---------------- UPDATE BANNER (ADMIN ONLY) ---------------- */

export const updateBanner = createAsyncThunk(
  "banners/updateBanner",
  async ({ bannerId, bannerData, isAdmin }, { rejectWithValue }) => {
    try {
      if (!isAdmin) {
        throw new Error("Unauthorized: Admin access required");
      }

      const { image, link } = bannerData;
      let imageId;

      /* Upload new image if changed */
      if (image instanceof File) {
        const upload = await storage.createFile(
          config.appwriteBucketId,
          ID.unique(),
          image
        );
        imageId = upload.$id;
      }

      const updateData = {};
      if (link !== undefined) updateData.link = link;
      if (imageId) updateData.image = imageId;

      const updatedBanner = await databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteBannersCollectionId,
        bannerId,
        updateData
      );

      return updatedBanner;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ---------------- SLICE ---------------- */

const bannerSlice = createSlice({
  name: "banners",
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

      /* FETCH */
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;

        state.banners = action.payload.map((banner) => ({
          ...banner,
          imageUrl: banner.image
            ? storage.getFilePreview(
                config.appwriteBucketId,
                banner.image
              )
            : null,
        }));
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;

        state.banners = state.banners.map((banner) =>
          banner.$id === action.payload.$id
            ? {
                ...action.payload,
                imageUrl: action.payload.image
                  ? storage.getFilePreview(
                      config.appwriteBucketId,
                      action.payload.image
                    )
                  : null,
              }
            : banner
        );
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = bannerSlice.actions;
export default bannerSlice.reducer;

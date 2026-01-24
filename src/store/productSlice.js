import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, storage } from '../lib/appwrite';

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID
      );
      return response.documents;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching a single product
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID,
        productId
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Process images to get download URLs
        const processedProducts = action.payload.map(product => ({
          ...product,
          imageUrls: product.images ? product.images.map(fileId =>
            storage.getFileDownload(import.meta.env.VITE_APPWRITE_BUCKET_ID, fileId)
          ) : []
        }));
        state.products = processedProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        // Process images to get download URLs
        const product = action.payload;
        state.selectedProduct = {
          ...product,
          imageUrls: product.images ? product.images.map(fileId =>
            storage.getFileDownload(import.meta.env.VITE_APPWRITE_BUCKET_ID, fileId)
          ) : []
        };
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, storage, ID } from '../lib/appwrite';

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

// Async thunk for adding a product
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const { name, price, discountPrice, category, sizes, images, description, stock, gender } = productData;

      // Upload images to Appwrite Storage
      const imageIds = [];
      for (const file of images) {
        const response = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          ID.unique(),
          file
        );
        imageIds.push(response.$id);
      }

      // Create product document
      const product = await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID,
        ID.unique(),
        {
          productName: name,
          price: parseFloat(price),
          discountPrice: discountPrice ? parseFloat(discountPrice) : null,
          category,
          gender,
          sizes: sizes.split(',').map(s => s.trim()),
          images: imageIds,
          description,
          stock: parseInt(stock),
        }
      );

      return product;
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
        // Process images to get download URLs and map fields
        const processedProducts = action.payload.map(product => {
          const imageUrls = product.images ? product.images.map(fileId =>
            storage.getFileView(import.meta.env.VITE_APPWRITE_BUCKET_ID, fileId)
          ) : [];
          return {
            ...product,
            name: product.productName, // Map productName to name for consistency
            imageUrls,
            image: imageUrls[0] || ''
          };
        });
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
        // Process images to get download URLs and map fields
        const product = action.payload;
        const imageUrls = product.images ? product.images.map(fileId =>
          storage.getFileView(import.meta.env.VITE_APPWRITE_BUCKET_ID, fileId)
        ) : [];
        state.selectedProduct = {
          ...product,
          name: product.productName, // Map productName to name for consistency
          imageUrls,
          image: imageUrls[0] || ''
        };
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
        // Optionally, could refetch products or add to state, but for now just clear error
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;

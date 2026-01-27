import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { databases, storage, ID } from "../lib/appwrite";

/* ---------- HELPERS ---------- */

const getSellingPrice = (price, discountPercent) => {
  return discountPercent
    ? Number(price) - (Number(price) * Number(discountPercent) / 100)
    : Number(price);
};

const normalizeSizes = (sizes) => {
  if (Array.isArray(sizes)) return sizes;
  if (typeof sizes === "string") {
    return sizes.split(",").map((s) => s.trim());
  }
  return [];
};

const normalizeProduct = (p) => {
  const imageUrls = (p.images || []).map((id) =>
    storage.getFileView(
      import.meta.env.VITE_APPWRITE_BUCKET_ID,
      id
    )
  );
  return {
    ...p,
    name: p.productName,
    imageUrls,
    image: imageUrls[0] || "",
  };
};

/* ---------- FETCH PRODUCTS ---------- */

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID
      );
      return res.documents;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------- FETCH SINGLE PRODUCT ---------- */

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      return await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID,
        productId
      );
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------- ADD PRODUCT ---------- */

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const {
        name,
        mrp,
        discountPercent,
        category,
        sizes,
        images,
        description,
        stock,
        gender,
      } = productData;

      const sellingPrice = getSellingPrice(mrp, discountPercent);

      const imageIds = [];
      for (const file of images || []) {
        const uploaded = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          ID.unique(),
          file
        );
        imageIds.push(uploaded.$id);
      }

      return await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID,
        ID.unique(),
        {
          productName: name,
          mrp: Number(mrp),
          discountPercent: discountPercent ? Number(discountPercent) : null,
          sellingPrice,
          category,
          gender,
          sizes: normalizeSizes(sizes),
          images: imageIds,
          description,
          stock: Number(stock),
        }
      );
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------- UPDATE PRODUCT ---------- */

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const {
        name,
        mrp,
        discountPercent,
        category,
        sizes,
        images,
        description,
        stock,
        gender,
      } = productData;

      const updateData = {
        productName: name,
        mrp: Number(mrp),
        discountPercent: discountPercent ? Number(discountPercent) : null,
        sellingPrice: getSellingPrice(mrp, discountPercent),
        category,
        gender,
        sizes: normalizeSizes(sizes),
        description,
        stock: Number(stock),
      };

      if (images && images.length > 0) {
        const imageIds = [];
        for (const file of images) {
          if (file instanceof File) {
            const uploaded = await storage.createFile(
              import.meta.env.VITE_APPWRITE_BUCKET_ID,
              ID.unique(),
              file
            );
            imageIds.push(uploaded.$id);
          } else {
            imageIds.push(file);
          }
        }
        updateData.images = imageIds;
      }

      return await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID,
        productId,
        updateData
      );
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------- DELETE PRODUCT ---------- */

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID,
        productId
      );
      return productId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------- SLICE ---------- */

const productSlice = createSlice({
  name: "products",
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
      /* FETCH ALL */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.map(normalizeProduct);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH ONE */
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = normalizeProduct(action.payload);
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ADD */
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(normalizeProduct(action.payload));
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = normalizeProduct(action.payload);
        const index = state.products.findIndex((prod) => prod.$id === action.payload.$id);
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
        if (state.selectedProduct && state.selectedProduct.$id === action.payload.$id) {
          state.selectedProduct = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (p) => p.$id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;

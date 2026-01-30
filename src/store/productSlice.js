import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { databases, storage, ID } from "../lib/appwrite";
import service from "../lib/appwrite";
import { getSellingPrice } from "../lib/utils";

const normalizeSizes = (sizes) => {
  if (Array.isArray(sizes)) return sizes;
  if (typeof sizes === "string") {
    return sizes.split(",").map((s) => s.trim());
  }
  return [];
};

const normalizeProduct = (p) => {
  const imageUrl = (p.imageUrl || []).map((id) =>
    storage.getFilePreview(
      import.meta.env.VITE_APPWRITE_BUCKET_ID,
      id
    )
  );
  return {
    ...p,
    imageUrl,
    image: imageUrl[0] || "",
  };
};

/* ---------- FETCH PRODUCTS ---------- */

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    if (state.products.productsLoaded) {
      // Already loaded, return existing products to avoid refetch
      return state.products.products;
    }
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

/* ---------- FETCH PRODUCT BY SLUG ---------- */

export const fetchProductBySlug = createAsyncThunk(
  "products/fetchProductBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      return await service.getProductBySlug(slug);
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
        color,
        material,
        pattern,
        neckType,
        sleeveLength,
        washCare,
        countryOfOrigin,
        isFeatured,
        productType,
      } = productData;

      // Validation
      if (!name || !mrp || !category || !gender || !sizes || !description || !productType || stock === undefined) {
        throw new Error('Missing required fields');
      }
      if (!['men', 'women', 'kids', 'unisex'].includes(gender.toLowerCase())) {
        throw new Error('Invalid gender');
      }
      if (Number(mrp) <= 0) {
        throw new Error('MRP must be greater than 0');
      }
      if (Number(stock) < 0) {
        throw new Error('Stock cannot be negative');
      }

      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

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
          name,
          mrp: Number(mrp),
          discountPercent: discountPercent ? Number(discountPercent) : null,
          category,
          gender: gender.toLowerCase(),
          sizes: normalizeSizes(sizes),
          imageUrl: imageIds,
          description,
          stock: Number(stock),
          slug,
          color,
          material,
          pattern,
          neckType,
          sleeveLength,
          washCare,
          countryOfOrigin,
          isFeatured: isFeatured || false,
          isActive: true,
          rating: 0,
          reviewCount: 0,
          productType,
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
        color,
        material,
        pattern,
        neckType,
        sleeveLength,
        washCare,
        countryOfOrigin,
        isFeatured,
        productType,
      } = productData;

      // Validation
      if (gender && !['men', 'women', 'kids', 'unisex'].includes(gender.toLowerCase())) {
        throw new Error('Invalid gender');
      }
      if (mrp && Number(mrp) <= 0) {
        throw new Error('MRP must be greater than 0');
      }
      if (stock !== undefined && Number(stock) < 0) {
        throw new Error('Stock cannot be negative');
      }

      const updateData = {
        name,
        mrp: mrp ? Number(mrp) : undefined,
        discountPercent: discountPercent !== undefined ? (discountPercent ? Number(discountPercent) : null) : undefined,
        category,
        gender: gender ? gender.toLowerCase() : undefined,
        sizes: sizes ? normalizeSizes(sizes) : undefined,
        description,
        stock: stock !== undefined ? Number(stock) : undefined,
        color,
        material,
        pattern,
        neckType,
        sleeveLength,
        washCare,
        countryOfOrigin,
        isFeatured,
        productType,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

      if (name) {
        updateData.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }

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
        updateData.imageUrl = imageIds;
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
    productsLoaded: false, // Cache flag
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
        state.productsLoaded = true;
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

      /* FETCH BY SLUG */
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload ? normalizeProduct(action.payload) : null;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
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

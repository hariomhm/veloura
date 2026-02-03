import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../lib/productService";

const normalizeSizes = (sizes) => {
  if (Array.isArray(sizes)) return sizes;
  if (typeof sizes === "string") {
    return sizes.split(",").map((s) => s.trim());
  }
  return [];
};

const normalizeProduct = (p) => {
  return {
    ...p,
    image: p.imageUrl?.[0] || "",
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
      const res = await productService.getProducts();
      return res;
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
      return await productService.getProduct(productId);
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
      return await productService.getProductBySlug(slug);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------- ADD PRODUCT ---------- */

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue, getState }) => {
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

      // Upload images (local upload endpoint)
      const imageUrls = [];
      for (const file of images || []) {
        if (file instanceof File) {
          const { url } = await productService.uploadFileToS3(null, file);
          imageUrls.push(url);
        } else if (typeof file === "string") {
          imageUrls.push(file);
        }
      }

      const product = {
        name,
        mrp: Number(mrp),
        discountPercent: discountPercent ? Number(discountPercent) : null,
        category,
        gender: gender.toLowerCase(),
        sizes: normalizeSizes(sizes),
        imageUrl: imageUrls,
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
      };

      return await productService.createProduct(product);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------- UPDATE PRODUCT ---------- */

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, productData }, { rejectWithValue, getState }) => {
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
        const imageUrls = [];
        for (const file of images) {
          if (file instanceof File) {
            const { url } = await productService.uploadFileToS3(null, file);
            imageUrls.push(url);
          } else if (typeof file === "string") {
            imageUrls.push(file);
          }
        }
        updateData.imageUrl = imageUrls;
      }

      return await productService.updateProduct(productId, updateData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------- DELETE PRODUCT ---------- */

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue, getState }) => {
    try {
      await productService.deleteProduct(productId);
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

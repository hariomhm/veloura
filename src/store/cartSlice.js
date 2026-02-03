import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSellingPrice } from "../lib/utils";
import cartService from "../lib/cartService";

/* -------- HELPERS -------- */

const getCartKey = (userId) => `cart_${userId || 'guest'}`;

const loadCartFromStorage = (userId) => {
  const key = getCartKey(userId);
  return JSON.parse(localStorage.getItem(key)) || [];
};

const saveCartToStorage = (userId, items) => {
  const key = getCartKey(userId);
  localStorage.setItem(key, JSON.stringify(items));
};

/* -------- ASYNC THUNKS -------- */

// Sync cart with API
export const syncCart = createAsyncThunk(
  "cart/syncCart",
  async (userId, { rejectWithValue, getState }) => {
    try {
      if (!userId) return [];
      return await cartService.getCart();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Save cart to API
export const saveCartToServer = createAsyncThunk(
  "cart/saveCartToServer",
  async ({ userId, items }, { rejectWithValue, getState }) => {
    try {
      if (!userId) return;
      await cartService.saveCart(items);
      return items;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* -------- INITIAL STATE -------- */

const initialState = {
  items: [], // { productId, name, image, mrp, discountPercent, sellingPrice, quantity, size }
  totalQuantity: 0,
  totalPrice: 0,
  userId: null,
  loading: false,
  error: null,
};

/* -------- SLICE -------- */

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* SET USER */
    setUser: (state, action) => {
      const userId = action.payload;
      if (state.userId !== userId) {
        // Save current cart before switching
        if (state.userId) {
          saveCartToStorage(state.userId, state.items);
        }
        // Load new user's cart
        let loadedItems = loadCartFromStorage(userId);
        // Migrate old cart items to new structure and validate
        state.items = loadedItems
          .filter(item => item && item.productId && item.quantity > 0) // Filter out invalid items
          .map(item => {
            if (item.product && item.product.mrp) {
              // Old structure: migrate to new
              const sellingPrice = getSellingPrice(item.product);
              return {
                productId: item.product.$id,
                name: item.product.name,
                image: item.product.imageUrl?.[0] || item.product.image || "",
                mrp: item.product.mrp,
                discountPercent: item.product.discountPercent || 0,
                sellingPrice,
                quantity: item.quantity,
                size: item.size,
              };
            }
            // Already new structure or missing product data - keep as is but ensure sellingPrice is valid
            if (item.mrp && !item.sellingPrice) {
              item.sellingPrice = getSellingPrice(item);
            }
            return item;
          });
        state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce(
          (sum, item) => sum + item.sellingPrice * item.quantity,
          0
        );
        state.userId = userId;
      }
    },

    /* ADD TO CART */
    addToCart: (state, action) => {
      const { product, quantity = 1, size } = action.payload;
      const itemSize = size || null; // Handle no size case

      const existingItem = state.items.find(
        (item) =>
          item.productId === product.$id &&
          item.size === itemSize
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const sellingPrice = getSellingPrice(product);
        state.items.push({
          productId: product.$id,
          name: product.name,
          image: product.imageUrl?.[0] || product.image || "",
          mrp: product.mrp,
          discountPercent: product.discountPercent || 0,
          sellingPrice,
          quantity,
          size: itemSize,
        });
      }

      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.sellingPrice * item.quantity,
        0
      );
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      saveCartToStorage(state.userId, state.items);
    },

    /* REMOVE FROM CART */
    removeFromCart: (state, action) => {
      const { productId, size } = action.payload;
      const itemSize = size || null;

      state.items = state.items.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.size === itemSize
          )
      );

      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.sellingPrice * item.quantity,
        0
      );
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      saveCartToStorage(state.userId, state.items);
    },

    /* UPDATE QUANTITY */
    updateQuantity: (state, action) => {
      const { productId, size, quantity } = action.payload;
      const itemSize = size || null;

      const item = state.items.find(
        (item) =>
          item.productId === productId &&
          item.size === itemSize
      );

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (i) =>
              !(
                i.productId === productId &&
                i.size === itemSize
              )
          );
        } else {
          item.quantity = quantity;
        }
      }

      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.sellingPrice * item.quantity,
        0
      );
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      saveCartToStorage(state.userId, state.items);
    },

    /* CLEAR CART */
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
      saveCartToStorage(state.userId, state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.loading = false;
        const serverItems = action.payload;
        if (serverItems.length > 0) {
          // Merge with local if needed, but for now, prefer server
          state.items = serverItems;
          state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
          state.totalPrice = state.items.reduce(
            (sum, item) => sum + item.sellingPrice * item.quantity,
            0
          );
          saveCartToStorage(state.userId, state.items);
        }
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveCartToServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveCartToServer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveCartToServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },

});

/* -------- EXPORTS -------- */

export const {
  setUser,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

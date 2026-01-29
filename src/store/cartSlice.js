import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSellingPrice } from "../lib/utils";
import { updateCart } from "../lib/cartService";

/* -------- INITIAL STATE -------- */

let items = JSON.parse(localStorage.getItem("cartItems")) || [];
let totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
let totalPrice = items.reduce(
  (sum, item) => sum + getSellingPrice(item.product) * item.quantity,
  0
);

const initialState = {
  items, // { product, quantity, size }
  totalQuantity,
  totalPrice,
};

/* -------- SLICE -------- */

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* ADD TO CART */
    addToCart: (state, action) => {
      const { product, quantity = 1, size } = action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.product.$id === product.$id &&
          item.size === size
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity, size });
      }

      state.totalPrice = state.items.reduce(
        (sum, item) =>
          sum + getSellingPrice(item.product) * item.quantity,
        0
      );
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    /* REMOVE FROM CART */
    removeFromCart: (state, action) => {
      const { productId, size } = action.payload;

      state.items = state.items.filter(
        (item) =>
          !(
            item.product.$id === productId &&
            item.size === size
          )
      );

      state.totalPrice = state.items.reduce(
        (sum, item) =>
          sum + getSellingPrice(item.product) * item.quantity,
        0
      );
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    /* UPDATE QUANTITY */
    updateQuantity: (state, action) => {
      const { productId, size, quantity } = action.payload;

      const item = state.items.find(
        (item) =>
          item.product.$id === productId &&
          item.size === size
      );

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (i) =>
              !(
                i.product.$id === productId &&
                i.size === size
              )
          );
        } else {
          item.quantity = quantity;
        }
      }

      state.totalPrice = state.items.reduce(
        (sum, item) =>
          sum + getSellingPrice(item.product) * item.quantity,
        0
      );
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    /* CLEAR CART */
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
  },

});

/* -------- ASYNC THUNKS -------- */

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async ({ userId, productId, size }, { dispatch }) => {
    try {
      // Update server-side cart
      await updateCart(userId, { items: [] }); // Placeholder, need to fetch current and remove
      // For now, just dispatch sync action
      dispatch(removeFromCart({ productId, size }));
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantityAsync",
  async ({ userId, productId, size, quantity }, { dispatch }) => {
    try {
      // Update server-side cart
      await updateCart(userId, { items: [] }); // Placeholder
      dispatch(updateQuantity({ productId, size, quantity }));
    } catch (error) {
      console.error("Failed to update quantity:", error);
      throw error;
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearCartAsync",
  async (userId, { dispatch }) => {
    try {
      await updateCart(userId, { items: [] });
      dispatch(clearCart());
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  }
);

/* -------- EXPORTS -------- */

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

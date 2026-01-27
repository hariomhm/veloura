import { createSlice } from "@reduxjs/toolkit";

/* -------- HELPER: FINAL PRICE -------- */

const getSellingPrice = (product) => {
  return (
    product.sellingPrice ||
    product.mrp ||
    product.price
  );
};

/* -------- INITIAL STATE -------- */

const initialState = {
  items: [], // { product, quantity, size }
  total: 0,
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

      state.total = state.items.reduce(
        (sum, item) =>
          sum + getSellingPrice(item.product) * item.quantity,
        0
      );
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

      state.total = state.items.reduce(
        (sum, item) =>
          sum + getSellingPrice(item.product) * item.quantity,
        0
      );
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

      state.total = state.items.reduce(
        (sum, item) =>
          sum + getSellingPrice(item.product) * item.quantity,
        0
      );
    },

    /* CLEAR CART */
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

/* -------- EXPORTS -------- */

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

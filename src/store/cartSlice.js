import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // Array of { product, quantity, size }
    total: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1, size } = action.payload;
      const existingItem = state.items.find(item => item.product.$id === product.$id && item.size === size);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity, size });
      }
      state.total = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    },
    removeFromCart: (state, action) => {
      const { productId, size } = action.payload;
      state.items = state.items.filter(item => !(item.product.$id === productId && item.size === size));
      state.total = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    },
    updateQuantity: (state, action) => {
      const { productId, size, quantity } = action.payload;
      const item = state.items.find(item => item.product.$id === productId && item.size === size);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(item => !(item.product.$id === productId && item.size === size));
        }
      }
      state.total = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

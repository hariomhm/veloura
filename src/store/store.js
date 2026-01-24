import { configureStore } from '@reduxjs/toolkit'
import themeSlice from './themeSlice'
import authSlice from './authSlice'
import productSlice from './productSlice'
import cartSlice from './cartSlice'

const store = configureStore({
    reducer:{
        theme : themeSlice,
        auth: authSlice,
        products: productSlice,
        cart: cartSlice,
    }
});

export default store;

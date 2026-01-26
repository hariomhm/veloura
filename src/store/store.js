import { configureStore } from '@reduxjs/toolkit'
import themeSlice from './themeSlice'
import authSlice from './authSlice'
import productSlice from './productSlice'
import cartSlice from './cartSlice'
import bannerSlice from './bannerSlice'
import userSlice from './userSlice'

const store = configureStore({
    reducer:{
        theme : themeSlice,
        auth: authSlice,
        products: productSlice,
        cart: cartSlice,
        banners: bannerSlice,
        users: userSlice,
    }
});

export default store;

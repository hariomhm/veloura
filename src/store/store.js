import { configureStore } from '@reduxjs/toolkit'
import themeSlice from './themeSlice'
import authSlice from './authSlice'
import productSlice from './productSlice'
import cartSlice from './cartSlice'
import orderSlice from './orderSlice'
import userSlice from './userSlice'
import wishlistSlice from './wishlistSlice'
import checkoutSlice from './checkoutSlice'

const store = configureStore({
    reducer:{
        theme : themeSlice,
        auth: authSlice,
        products: productSlice,
        cart: cartSlice,
        orders: orderSlice,
        users: userSlice,
        wishlist: wishlistSlice,
        checkout: checkoutSlice,
    }
});

export default store;

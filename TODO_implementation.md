# Implementation Steps

## Step 1: Update Config
- [x] Add banners and users collections to config.js

## Step 2: Banner Management
- [x] Create bannerSlice.js with fetchBanners, updateBanner thunks
- [x] Create ManageBanners.jsx admin page
- [x] Update AdminDashboard.jsx to include Manage Banners option
- [x] Add manage-banners route in App.jsx

## Step 3: Product Management
- [x] Extend productSlice.js with updateProduct, deleteProduct thunks
- [x] Create ManageProducts.jsx admin page
- [x] Create EditProduct.jsx admin page
- [x] Add manage-products and edit-product routes in App.jsx

## Step 4: User Management
- [x] Create userSlice.js with fetchUsers, banUser, unbanUser thunks
- [x] Create ManageUsers.jsx admin page
- [x] Update AdminDashboard.jsx to include Manage Users option
- [x] Add manage-users route in App.jsx
- [x] Update authSlice.js to handle banned users

## Step 5: Dynamic Banners
- [x] Update Home.jsx to fetch and display banners dynamically

## Step 6: Optional Enhancements
- [x] Enhance ManageOrders.jsx with search/filter

## Step 7: Testing
- [x] Run the app and test all features
- [x] Fix authentication bug in Checkout.jsx - incorrect auth state selector causing login redirects for logged-in users

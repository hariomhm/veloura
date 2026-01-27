const config = {
  appwriteUrl: String(
    import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  ),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteProductsCollectionId: String(
    import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID,
  ),
  appwriteOrdersCollectionId: String(
    import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID,
  ),
  appwriteBannersCollectionId: String(
    import.meta.env.VITE_APPWRITE_BANNERS_COLLECTION_ID,
  ),
  appwriteUsersCollectionId: String(
    import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  ),
  appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),

  currencySymbol: "₹",

  // Razorpay (frontend)
  razorpayKeyId: String(import.meta.env.VITE_RAZORPAY_KEY_ID),

  // Appwrite Function ID (IMPORTANT)
  razorpayFunctionId: String(import.meta.env.VITE_RAZORPAY_FUNCTION_ID),
};

export default config;

const config = {
  appwriteUrl:
    import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",

  appwriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  appwriteDatabaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,

  appwriteProductsCollectionId:
    import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID,

  appwriteOrdersCollectionId:
    import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID,

  appwriteBannersCollectionId:
    import.meta.env.VITE_APPWRITE_BANNERS_COLLECTION_ID,

  appwriteUsersCollectionId:
    import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,


  appwriteBucketId:
    import.meta.env.VITE_APPWRITE_BUCKET_ID,

  appwriteNewsletterCollectionId:
    import.meta.env.VITE_APPWRITE_NEWSLETTER_COLLECTION_ID,

  currencySymbol: "₹",

  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
  razorpayFunctionId: import.meta.env.VITE_RAZORPAY_FUNCTION_ID,
};

export default config;

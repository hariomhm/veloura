const config = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL || 'https://nyc.cloud.appwrite.io/v1'),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'your_project_id'),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID || 'your_database_id'),
    appwriteProductsCollectionId: String(import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID || 'products_collection_id'),
    appwriteOrdersCollectionId: String(import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID || 'orders_collection_id'),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID || 'bucket_id'),
    currencySymbol: '₹'
}

export default config;

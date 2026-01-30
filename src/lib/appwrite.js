import config from "../config.js";
import { retryOperation } from "./utils.js";
import {
  Client,
  Databases,
  Storage,
  Query,
  Account,
  ID,
  Functions,
} from "appwrite";

/* ------------------ SAFETY CHECK ------------------ */

const requiredKeys = [
  "appwriteUrl",
  "appwriteProjectId",
  "appwriteDatabaseId",
  "appwriteProductsCollectionId",
  "appwriteOrdersCollectionId",
  "appwriteBucketId",
  "appwriteUsersCollectionId",
  "appwriteWishlistCollectionId",
  "appwriteNewsletterCollectionId",
];

requiredKeys.forEach((key) => {
  if (!config[key] || config[key] === "undefined") {
    throw new Error(`❌ Missing Appwrite config: ${key}`);
  }
});

/* ------------------ APPWRITE CLIENT ------------------ */

const client = new Client()
  .setEndpoint(config.appwriteUrl)
  .setProject(config.appwriteProjectId);

/* ------------------ SERVICES ------------------ */

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);
export const functions = new Functions(client);

/* ------------------ SERVICE CLASS ------------------ */

export class Service {
  /* ---------- PRODUCTS ---------- */

  async getProducts(queries = [], limit = 100) {
    try {
      return await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteProductsCollectionId,
        [...queries, Query.limit(limit)]
      );
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to load products. Please try again.');
    }
  }

  async getProduct(productId) {
    try {
      return await databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteProductsCollectionId,
        productId
      );
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to load product. Please try again.');
    }
  }

  async getFeaturedProducts(limit = 10) {
    try {
      return await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteProductsCollectionId,
        [Query.equal("isFeatured", true), Query.equal("isActive", true), Query.limit(limit)]
      );
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw new Error('Failed to load featured products. Please try again.');
    }
  }

  async getProductBySlug(slug) {
    try {
      const res = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteProductsCollectionId,
        [Query.equal("slug", slug)]
      );
      return res.documents[0] || null;
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      throw new Error('Failed to load product. Please try again.');
    }
  }

  /* ---------- ORDERS ---------- */

  async createOrder(orderData) {
    return await retryOperation(async () => {
      return await databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteOrdersCollectionId,
        ID.unique(),
        orderData
      );
    }, 3, 1000);
  }

  async getOrders(userId, limit = 50) {
    try {
      return await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteOrdersCollectionId,
        [Query.equal("userId", userId), Query.orderDesc("$createdAt"), Query.limit(limit)]
      );
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to load orders. Please try again.');
    }
  }

  async getOrder(orderId) {
    try {
      return await databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteOrdersCollectionId,
        orderId
      );
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Failed to load order. Please try again.');
    }
  }

  /* ---------- USERS ---------- */

  async getUsers(limit = 100) {
    try {
      return await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteUsersCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(limit)]
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to load users. Please try again.');
    }
  }

  async createUser(userData) {
    try {
      return await databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteUsersCollectionId,
        ID.unique(),
        userData
      );
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user. Please try again.');
    }
  }

  async getUser(userId) {
    try {
      return await databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteUsersCollectionId,
        userId
      );
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to load user. Please try again.');
    }
  }

  async getUserByUserId(userid) {
    try {
      const res = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteUsersCollectionId,
        [Query.equal("userId", userid)]
      );
      return res.documents[0] || null;
    } catch (error) {
      console.error('Error fetching user by userId:', error);
      throw new Error('Failed to load user. Please try again.');
    }
  }

  async updateUser(userId, data) {
    try {
      return await databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteUsersCollectionId,
        userId,
        data
      );
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user. Please try again.');
    }
  }

  /* ---------- FILES ---------- */

  async uploadFile(file) {
    try {
      return await storage.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file. Please try again.');
    }
  }

  async deleteFile(fileId) {
    try {
      return await storage.deleteFile(
        config.appwriteBucketId,
        fileId
      );
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file. Please try again.');
    }
  }

  async getFilePreview(fileId) {
    try {
      return await storage.getFilePreview(
        config.appwriteBucketId,
        fileId
      );
    } catch (error) {
      console.error('Error getting file preview:', error);
      throw new Error('Failed to load file preview. Please try again.');
    }
  }

  /* ---------- WISHLIST ---------- */

  async getWishlist(userId, limit = 100) {
    try {
      const res = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteWishlistCollectionId,
        [Query.equal("userId", userId), Query.limit(limit)]
      );
      return res.documents;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw new Error('Failed to load wishlist. Please try again.');
    }
  }

  async addToWishlist(userId, productId) {
    try {
      return await databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteWishlistCollectionId,
        ID.unique(),
        {
          userId,
          productId,
          createdAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw new Error('Failed to add to wishlist. Please try again.');
    }
  }

  async removeFromWishlist(wishlistId) {
    try {
      return await databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteWishlistCollectionId,
        wishlistId
      );
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw new Error('Failed to remove from wishlist. Please try again.');
    }
  }

  async toggleWishlist(userId, productId) {
    try {
      const wishlist = await this.getWishlist(userId);
      const existing = wishlist.find(item => item.productId === productId);
      if (existing) {
        await this.removeFromWishlist(existing.$id);
        return wishlist.filter(item => item.productId !== productId).map(item => item.productId);
      } else {
        await this.addToWishlist(userId, productId);
        return [...wishlist.map(item => item.productId), productId];
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      throw new Error('Failed to update wishlist. Please try again.');
    }
  }

  /* ---------- NEWSLETTER ---------- */

  async subscribeNewsletter(email) {
    try {
      if (!email || !email.includes('@')) throw new Error('Invalid email');

      const verificationToken = ID.unique();
      const unsubToken = ID.unique();

      return await databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteNewsletterCollectionId,
        ID.unique(),
        {
          email,
          isActive: false,
          isVerified: false,
          verificationToken,
          unsubToken,
          source: 'website',
          createdAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw new Error('Failed to subscribe to newsletter. Please try again.');
    }
  }

  async verifyNewsletter(token) {
    try {
      const res = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteNewsletterCollectionId,
        [Query.equal("verificationToken", token)]
      );
      if (!res.documents.length) throw new Error('Invalid token');

      const doc = res.documents[0];
      return await databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteNewsletterCollectionId,
        doc.$id,
        {
          isActive: true,
          isVerified: true,
          verifiedAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error verifying newsletter:', error);
      throw new Error('Failed to verify newsletter subscription. Please try again.');
    }
  }

  async unsubscribeNewsletter(token) {
    try {
      const res = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteNewsletterCollectionId,
        [Query.equal("unsubToken", token)]
      );
      if (!res.documents.length) throw new Error('Invalid token');

      const doc = res.documents[0];
      return await databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteNewsletterCollectionId,
        doc.$id,
        {
          isActive: false,
        }
      );
    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error);
      throw new Error('Failed to unsubscribe from newsletter. Please try again.');
    }
  }

  /* ---------- RAZORPAY ---------- */

  async createRazorpayOrder(amount) {
    if (!amount || amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    const execution = await functions.createExecution(
      config.razorpayFunctionId,
      JSON.stringify({ amount })
    );

    const response = JSON.parse(execution.responseBody);

    if (!response?.id) {
      throw new Error("Invalid Razorpay response");
    }

    return response;
  }
}

/* ------------------ EXPORT ------------------ */

const service = new Service();
export default service;
export { ID, Query };

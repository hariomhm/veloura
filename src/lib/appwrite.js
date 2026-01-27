import config from "../config.js";
import {
  Client,
  Databases,
  Storage,
  Query,
  Account,
  ID,
  Functions,
} from "appwrite";

/* ------------------ APPWRITE CLIENT ------------------ */

const client = new Client();

client
  .setEndpoint(config.appwriteUrl)
  .setProject(config.appwriteProjectId);

/* ------------------ APPWRITE SERVICES ------------------ */

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);
export const functions = new Functions(client);

/* ------------------ SERVICE CLASS ------------------ */

export class Service {
  /* -------- PRODUCTS -------- */

  async createPost({ title, slug, content, imageFile, status, userId }) {
    try {
      return await databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteProductsCollectionId,
        slug,
        {
          title,
          content,
          imageFile,
          status,
          userId,
        }
      );
    } catch (error) {
      console.error("Create post error:", error);
      throw error;
    }
  }

  async updatePost(slug, { title, content, imageFile, status }) {
    try {
      return await databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteProductsCollectionId,
        slug,
        {
          title,
          content,
          imageFile,
          status,
        }
      );
    } catch (error) {
      console.error("Update post error:", error);
      throw error;
    }
  }

  async deletePost(slug) {
    try {
      await databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteProductsCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.error("Delete post error:", error);
      throw error;
    }
  }

  async getPost(slug) {
    try {
      return await databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteProductsCollectionId,
        slug
      );
    } catch (error) {
      console.error("Get post error:", error);
      return null;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteProductsCollectionId,
        queries
      );
    } catch (error) {
      console.error("Get posts error:", error);
      return null;
    }
  }

  /* -------- FILE UPLOAD -------- */

  async uploadFile(file) {
    try {
      return await storage.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.error("Upload file error:", error);
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      await storage.deleteFile(config.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error("Delete file error:", error);
      throw error;
    }
  }

  getFilePreview(fileId) {
    return storage.getFileView(config.appwriteBucketId, fileId);
  }

  /* -------- RAZORPAY PAYMENT (FINAL) -------- */

  /**
   * Create Razorpay Order using Appwrite Cloud Function
   * @param {number} amount - amount in INR
   * @returns Razorpay order object
   */
async createRazorpayOrder(amount) {
  try {
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    const execution = await functions.createExecution(
      config.razorpayFunctionId,
      JSON.stringify({
        amount: amount, // ✅ SEND INR ONLY
      })
    );

    const response = JSON.parse(execution.responseBody);

    if (!response?.id) {
      throw new Error("Invalid Razorpay order response");
    }

    return response;
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    throw error;
  }
}

}

/* ------------------ EXPORT INSTANCE ------------------ */

const service = new Service();
export default service;
export { ID };

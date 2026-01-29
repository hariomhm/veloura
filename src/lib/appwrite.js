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

/* ------------------ SAFETY CHECK ------------------ */

const requiredKeys = [
  "appwriteUrl",
  "appwriteProjectId",
  "appwriteDatabaseId",
  "appwriteProductsCollectionId",
  "appwriteOrdersCollectionId",
  "appwriteBucketId",
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

/* ------------------ CART CACHE ------------------ */

const cartCache = new Map();

const getCachedCart = (userId) => {
  const cached = cartCache.get(userId);
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return cached.data;
  }
  cartCache.delete(userId);
  return null;
};

const setCachedCart = (userId, cart) => {
  cartCache.set(userId, { data: cart, timestamp: Date.now() });
};

const clearCartCache = (userId) => {
  cartCache.delete(userId);
};

/* ------------------ SERVICE CLASS ------------------ */

export class Service {
  /* ---------- PRODUCTS ---------- */

  async getProducts(queries = []) {
    return databases.listDocuments(
      config.appwriteDatabaseId,
      config.appwriteProductsCollectionId,
      queries
    );
  }

  async getProduct(productId) {
    return databases.getDocument(
      config.appwriteDatabaseId,
      config.appwriteProductsCollectionId,
      productId
    );
  }

  /* ---------- FILES ---------- */

  async uploadFile(file) {
    return storage.createFile(
      config.appwriteBucketId,
      ID.unique(),
      file
    );
  }

  getFilePreview(fileId) {
    return storage.getFileView(config.appwriteBucketId, fileId);
  }

  async deleteFile(fileId) {
    await storage.deleteFile(config.appwriteBucketId, fileId);
    return true;
  }

  /* ---------- CART ---------- */

async getCart(userId) {
  const cached = getCachedCart(userId);
  if (cached) return cached;

  const res = await databases.listDocuments(
    config.appwriteDatabaseId,
    config.appwriteCartCollectionId,
    [Query.equal("userId", userId)]
  );

  const cart = res.documents[0] || null;
  if (cart) setCachedCart(userId, cart);

  return cart;
}


async createCart({ userId, items, totalQuantity, totalPrice }) {

  console.log("first", items)
  const cartDoc = await databases.createDocument(
    config.appwriteDatabaseId,
    config.appwriteCartCollectionId,
    ID.unique(),
    {
      userId,
      items, // object[]
      totalQuantity,
      totalPrice,
      updatedAt: new Date().toISOString(),
    }
  );

  // 🔥 NORMALIZE BEFORE CACHING / RETURNING
  const normalizedCart = {
    $id: cartDoc.$id,
    userId: cartDoc.userId,
    items: cartDoc.items, // ← already objects
    totalQuantity: cartDoc.totalQuantity,
    totalPrice: cartDoc.totalPrice,
  };

  setCachedCart(userId, normalizedCart); // ✅ objects only

  return normalizedCart;                 // ✅ objects only
}


async updateCart(userId, { items, totalQuantity, totalPrice }) {
  try {
    const res = await databases.listDocuments(
      config.appwriteDatabaseId,
      config.appwriteCartCollectionId,
      [Query.equal("userId", userId)]
    );

    const payload = {
      items, // ✅ STRING
      totalQuantity,
      totalPrice,
      updatedAt: new Date().toISOString(),
    };

    let cart;

    if (res.documents.length) {
      cart = await databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCartCollectionId,
        res.documents[0].$id,
        payload
      );
    } else {
      // When creating new cart, items should be object[] not string
      cart = await this.createCart({
        userId,
        items: JSON.parse(items), // Convert string back to objects for createCart
        totalQuantity,
        totalPrice
      });
    }

    setCachedCart(userId, cart);
    return cart;
  } catch (err) {
    clearCartCache(userId);
    throw err;
  }
}


  async deleteCart(userId) {
    const res = await databases.listDocuments(
      config.appwriteDatabaseId,
      config.appwriteCartCollectionId,
      [Query.equal("userId", userId)]
    );

    if (res.documents.length) {
      await databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteCartCollectionId,
        res.documents[0].$id
      );
    }

    clearCartCache(userId);
    return true;
  }

  /* ---------- ORDERS ---------- */

  async createOrder(orderData) {
    return databases.createDocument(
      config.appwriteDatabaseId,
      config.appwriteOrdersCollectionId,
      ID.unique(),
      {
        ...orderData,
        orderNumber: `ORD-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
  }

  async getUserOrders(userId) {
    return databases.listDocuments(
      config.appwriteDatabaseId,
      config.appwriteOrdersCollectionId,
      [Query.equal("userId", userId)]
    );
  }

  async updateOrder(orderId, data) {
    return databases.updateDocument(
      config.appwriteDatabaseId,
      config.appwriteOrdersCollectionId,
      orderId,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      }
    );
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

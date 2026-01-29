import { databases, ID } from "../lib/appwrite";
import { Query } from "appwrite";

const DB = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const CARTS = import.meta.env.VITE_APPWRITE_CARTS_COLLECTION_ID;

export const updateCart = async (userId, data) => {
  const res = await databases.listDocuments(DB, CARTS, [
    Query.equal("userId", userId),
  ]);

  if (res.documents.length) {
    return databases.updateDocument(
      DB,
      CARTS,
      res.documents[0].$id,
      data
    );
  }

  return databases.createDocument(DB, CARTS, ID.unique(), {
    userId,
    ...data,
  });
};

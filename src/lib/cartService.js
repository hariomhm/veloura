import { databases, ID } from "../lib/appwrite";
import { Query } from "appwrite";
import config from "../config";

const DB = config.appwriteDatabaseId;
const CARTS = config.appwriteCartsCollectionId;

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

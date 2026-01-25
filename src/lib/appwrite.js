import config from "../config.js";
import { Client, Databases, Storage, Query, Account, ID } from "appwrite";

const client = new Client();

console.log("first", config.appwriteUrl)

client
  .setEndpoint(config.appwriteUrl)
  .setProject(config.appwriteProjectId);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

export class Service{
    constructor(){
        // Use the global instances
    }

    async createPost({title, slug, content, imageFile, status, userId}){
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
            )
        } catch (error) {
            throw error;
        }
    }

    async updatePost(slug, {title, content, imageFile, status}){
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
            )
        } catch (error) {
            throw error;
        }
    }

    async deletePost(slug){
        try {
            await databases.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteProductsCollectionId,
                slug

            )
            return true
        } catch (error) {
            throw error;
        }
    }

    async getPost(slug){
        try {
            return await databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteProductsCollectionId,
                slug

            )
        } catch (error) {
            return null;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteProductsCollectionId,
                queries,


            )
        } catch (error) {
            return null;
        }
    }

    // file upload service

    async uploadFile(file){
        try {
            return await storage.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            throw error;
        }
    }

    async deleteFile(fileId){
        try {
            await storage.deleteFile(
                config.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            throw error;
        }
    }

    getFilePreview(fileId){
        return storage.getFileView(
            config.appwriteBucketId,
            fileId
        )
    }
}

const service = new Service()
export default service
export { ID }

import config from "../config.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  constructor() {
    this.client = new Client();

    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    this.account = new Account(this.client);
  }

  /* -------- CREATE ACCOUNT -------- */

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        // Auto-login after signup
        return this.login({ email, password });
      }

      return userAccount;
    } catch (error) {
      console.error("Create account error:", error);
      throw error;
    }
  }

  /* -------- LOGIN -------- */

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(
        email,
        password
      );
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /* -------- CURRENT USER -------- */

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      return null;
    }
  }

  /* -------- LOGOUT -------- */

  async logout() {
    try {
      await this.account.deleteSessions();
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }
}

const authService = new AuthService();
export default authService;

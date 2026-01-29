import { account, ID } from "./appwrite";

const authService = {
  // Get current user
  getCurrentUser: async () => {
    if (!localStorage.getItem('isLoggedIn')) return null;
    try {
      return await account.get();
    } catch {
      localStorage.removeItem('isLoggedIn');
      return null;
    }
  },

  // Create account
  createAccount: async (email, password, name) => {
    return await account.create(ID.unique(), email, password, name);
  },

  // Login
  login: async (email, password) => {
    const session = await account.createEmailPasswordSession(email, password);
    localStorage.setItem('isLoggedIn', 'true');
    return session;
  },

  // Logout
  logout: async () => {
    await account.deleteSession("current");
    localStorage.removeItem('isLoggedIn');
  },

  // Update profile
  updateProfile: async (profileData) => {
    await account.updatePrefs(profileData);
    return true;
  },
};

export default authService;

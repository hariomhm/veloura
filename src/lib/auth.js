import { account, ID } from "./appwrite";
import service from "./appwrite";

let cachedUser = null; // Cache for user data
let sessionCheckInterval = null; // Interval for session refresh

const authService = {
  // Get current user with session validation
  getCurrentUser: async () => {
    try {
      const authUser = await account.get();
      const userDoc = await service.getUserByUserId(authUser.$id);
      cachedUser = { ...authUser, userDoc }; // Cache the result
      return cachedUser;
    } catch (error) {
      console.error('Session expired or invalid:', error);
      localStorage.removeItem('isLoggedIn');
      cachedUser = null; // Clear cache on error
      return null;
    }
  },

  // Create account
  createAccount: async (email, password, name) => {
    try {
      return await account.create(ID.unique(), email, password, name);
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  // Login with session creation
  login: async (email, password) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      localStorage.setItem('isLoggedIn', 'true');
      // Start session refresh
      authService.startSessionRefresh();
      return session;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // Logout with comprehensive cleanup
  logout: async () => {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error('Error deleting session:', error);
    }
    localStorage.removeItem('isLoggedIn');
    cachedUser = null; // Clear cache
    if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval);
      sessionCheckInterval = null;
    }
  },

  // Start session refresh interval
  startSessionRefresh: () => {
    if (sessionCheckInterval) return; // Already running
    sessionCheckInterval = setInterval(async () => {
      try {
        await account.get(); // Validate session
      } catch {
        console.warn('Session expired, logging out');
        await authService.logout();
        window.location.reload(); // Force app reload
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  },

  // Update profile
  updateProfile: async (profileData) => {
    await account.updatePrefs(profileData);
    return true;
  },

  // Update user document in users collection
  updateUserDocument: async (userId, data) => {
    return await service.updateUser(userId, data);
  },
};

export default authService;

import { apiRequest } from "./apiClient";

class AuthService {
  async login(email, password) {
    return apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    });
  }

  async register(name, email, password) {
    return apiRequest("/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
  }

  async googleLogin(idToken) {
    return apiRequest("/auth/google", {
      method: "POST",
      body: { idToken },
    });
  }

  async getSession() {
    return apiRequest("/auth/session", { method: "GET" });
  }

  async refresh() {
    return apiRequest("/auth/refresh", { method: "POST" });
  }

  async logout() {
    return apiRequest("/auth/logout", { method: "POST" });
  }

  async logoutAll() {
    return apiRequest("/auth/logout-all", { method: "POST" });
  }
}

const authService = new AuthService();
export default authService;

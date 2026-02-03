import { apiRequest } from "./apiClient";

class UserService {
  async getUsers(queryParams = {}) {
    const params = new URLSearchParams();
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key]) params.append(key, queryParams[key]);
    });

    const qs = params.toString();
    return apiRequest(`/users${qs ? `?${qs}` : ""}`, { method: "GET" });
  }

  async updateUser(userId, updateData) {
    return apiRequest(`/users/${userId}`, {
      method: "PUT",
      body: updateData,
    });
  }

  async banUser(userId, banReason) {
    return this.updateUser(userId, { isBanned: true, banReason: banReason || "" });
  }

  async unbanUser(userId) {
    return this.updateUser(userId, { isBanned: false, banReason: "" });
  }

  async updateUserRole(userId, role) {
    return this.updateUser(userId, { role });
  }

  async updateUserStatus(userId, isActive) {
    return this.updateUser(userId, { isActive });
  }

  async updateProfile(updateData) {
    return apiRequest("/users/me", {
      method: "PUT",
      body: updateData,
    });
  }

  async getUserProfile(userId) {
    return apiRequest(`/users/${userId}`, { method: "GET" });
  }

  async getMe() {
    return apiRequest("/users/me", { method: "GET" });
  }
}

const userService = new UserService();
export default userService;

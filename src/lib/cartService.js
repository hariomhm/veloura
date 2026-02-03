import { apiRequest } from "./apiClient";

class CartService {
  async getCart() {
    const data = await apiRequest("/cart", { method: "GET" });
    return data.items || [];
  }

  async saveCart(items) {
    return apiRequest("/cart", {
      method: "PUT",
      body: { items },
    });
  }
}

const cartService = new CartService();
export default cartService;

import { apiRequest } from "./apiClient";

class WishlistService {
  async getWishlist() {
    const data = await apiRequest("/wishlist", { method: "GET" });
    return data.items || [];
  }

  async addToWishlist(productId) {
    return apiRequest("/wishlist", {
      method: "POST",
      body: { productId },
    });
  }

  async removeFromWishlist(productId) {
    return apiRequest(`/wishlist/${productId}`, { method: "DELETE" });
  }

  async toggleWishlist(productId) {
    const wishlist = await this.getWishlist();
    const exists = wishlist.includes(productId);

    if (exists) {
      await this.removeFromWishlist(productId);
      return wishlist.filter((id) => id !== productId);
    }

    await this.addToWishlist(productId);
    return [...wishlist, productId];
  }
}

const wishlistService = new WishlistService();
export default wishlistService;

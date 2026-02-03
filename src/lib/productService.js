import { apiRequest } from "./apiClient";

class ProductService {
  async getProducts(queryParams = {}) {
    const params = new URLSearchParams();
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key]) params.append(key, queryParams[key]);
    });
    const qs = params.toString();
    return apiRequest(`/products${qs ? `?${qs}` : ""}`, { method: "GET" });
  }

  async getProduct(productId) {
    return apiRequest(`/products/${productId}`, { method: "GET" });
  }

  async getFeaturedProducts(limit = 10) {
    return this.getProducts({ isFeatured: true, isActive: true, limit });
  }

  async getProductBySlug(slug) {
    return apiRequest(`/products/slug/${slug}`, { method: "GET" });
  }

  async createProduct(productData) {
    return apiRequest("/products", {
      method: "POST",
      body: productData,
    });
  }

  async updateProduct(productId, productData) {
    return apiRequest(`/products/${productId}`, {
      method: "PUT",
      body: productData,
    });
  }

  async deleteProduct(productId) {
    return apiRequest(`/products/${productId}`, { method: "DELETE" });
  }

  async uploadFileToS3(_signedUrl, file) {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest("/uploads", {
      method: "POST",
      body: formData,
    });
  }
}

const productService = new ProductService();
export default productService;

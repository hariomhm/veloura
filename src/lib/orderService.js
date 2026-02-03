import { apiRequest } from "./apiClient";

class OrderService {
  async createCheckoutSession(items, couponCode) {
    return apiRequest("/checkout/quote", {
      method: "POST",
      body: { items, couponCode },
    });
  }

  async createPaymentOrder(checkoutId) {
    return apiRequest("/payments/create-order", {
      method: "POST",
      body: { checkoutId },
    });
  }

  async confirmOrder(payload) {
    return apiRequest("/orders/confirm", {
      method: "POST",
      body: payload,
    });
  }

  async getOrders(userId, queryParams = {}) {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key]) params.append(key, queryParams[key]);
    });
    const qs = params.toString();
    return apiRequest(`/orders${qs ? `?${qs}` : ""}`, { method: "GET" });
  }

  async getOrder(orderId) {
    return apiRequest(`/orders/${orderId}`, { method: "GET" });
  }

  async getAllOrders() {
    return apiRequest("/orders/admin", { method: "GET" });
  }

  async updateOrderStatus(orderId, status) {
    return apiRequest(`/orders/${orderId}/status`, {
      method: "PUT",
      body: { status },
    });
  }

  async verifyPayment(paymentId, orderId, signature) {
    return apiRequest("/payments/verify", {
      method: "POST",
      body: { paymentId, orderId, signature },
    });
  }
}

const orderService = new OrderService();
export default orderService;

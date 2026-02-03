import { apiRequest } from "./apiClient";

class NewsletterService {
  async subscribe(email) {
    return apiRequest("/newsletter/subscribe", {
      method: "POST",
      body: { email },
    });
  }

  async verify(token) {
    return apiRequest("/newsletter/verify", {
      method: "POST",
      body: { token },
    });
  }

  async unsubscribe(token) {
    return apiRequest("/newsletter/unsubscribe", {
      method: "POST",
      body: { token },
    });
  }
}

const newsletterService = new NewsletterService();
export default newsletterService;

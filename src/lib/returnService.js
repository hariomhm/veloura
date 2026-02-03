import { apiRequest } from "./apiClient";

class ReturnService {
  async createReturnRequest(payload) {
    return apiRequest("/returns", {
      method: "POST",
      body: payload,
    });
  }

  async getMyReturns() {
    return apiRequest("/returns", { method: "GET" });
  }
}

const returnService = new ReturnService();
export default returnService;

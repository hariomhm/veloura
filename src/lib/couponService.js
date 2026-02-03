import { apiRequest } from "./apiClient";

class CouponService {
  async validateCoupon(items, couponCode) {
    return apiRequest("/coupons/validate", {
      method: "POST",
      body: { items, couponCode },
    });
  }
}

const couponService = new CouponService();
export default couponService;

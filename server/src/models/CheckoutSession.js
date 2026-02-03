import mongoose from "mongoose";
import { toPublicJsonTransform } from "../utils/serialization.js";

const checkoutItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    size: { type: String, default: null },
    mrp: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const checkoutSessionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    items: { type: [checkoutItemSchema], default: [] },
    subtotal: { type: Number, required: true },
    discountTotal: { type: Number, required: true },
    total: { type: Number, required: true },
    couponCode: { type: String, default: "" },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["pending", "completed", "expired"], default: "pending" },
    paymentProvider: { type: String, default: "razorpay" },
    paymentOrderId: { type: String, default: "" },
    orderId: { type: String, default: "" },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

checkoutSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

checkoutSessionSchema.set("toJSON", { transform: toPublicJsonTransform });

export const CheckoutSession = mongoose.model("CheckoutSession", checkoutSessionSchema);


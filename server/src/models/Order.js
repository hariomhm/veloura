import mongoose from "mongoose";
import { toPublicJsonTransform } from "../utils/serialization.js";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    size: { type: String, default: null },
    price: { type: Number, required: true },
    mrp: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    items: { type: [orderItemSchema], default: [] },
    subtotal: { type: Number, required: true },
    discountTotal: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    couponCode: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered"],
      default: "pending",
    },
    paymentStatus: { type: String, default: "pending" },
    paymentId: { type: String, default: "" },
    orderId: { type: String, default: "" },
    paymentProvider: { type: String, default: "razorpay" },

    customerName: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
    addressLine: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },

    trackingNumber: { type: String, default: "" },
    carrier: { type: String, default: "" },
    estimatedDelivery: { type: Date, default: null },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });

orderSchema.set("toJSON", {
  transform: (doc, ret) => {
    toPublicJsonTransform(doc, ret);
    ret.total = ret.totalPrice;
    ret.totalAmount = ret.totalPrice;
    return ret;
  },
});

export const Order = mongoose.model("Order", orderSchema);

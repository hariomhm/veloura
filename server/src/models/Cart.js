import mongoose from "mongoose";
import { toPublicJsonTransform } from "../utils/serialization.js";

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    mrp: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    sellingPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, default: null },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

cartSchema.set("toJSON", { transform: toPublicJsonTransform });

export const Cart = mongoose.model("Cart", cartSchema);


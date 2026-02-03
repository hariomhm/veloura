import mongoose from "mongoose";
import { toPublicJsonTransform } from "../utils/serialization.js";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null },
    active: { type: Boolean, default: true },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    usageLimit: { type: Number, default: null },
    usageCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: null },
    usageByUser: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 });

couponSchema.set("toJSON", { transform: toPublicJsonTransform });

export const Coupon = mongoose.model("Coupon", couponSchema);


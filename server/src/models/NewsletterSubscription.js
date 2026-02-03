import mongoose from "mongoose";
import { toPublicJsonTransform } from "../utils/serialization.js";

const newsletterSubscriptionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, enum: ["pending", "verified", "unsubscribed"], default: "pending" },
    token: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

newsletterSubscriptionSchema.set("toJSON", { transform: toPublicJsonTransform });

export const NewsletterSubscription = mongoose.model(
  "NewsletterSubscription",
  newsletterSubscriptionSchema
);


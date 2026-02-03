import mongoose from "mongoose";
import { toPublicJsonTransform } from "../utils/serialization.js";

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    items: { type: [String], default: [] },
  },
  { timestamps: true }
);

wishlistSchema.set("toJSON", { transform: toPublicJsonTransform });

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);


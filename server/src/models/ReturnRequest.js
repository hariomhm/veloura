import mongoose from "mongoose";
import { toPublicJsonTransform } from "../utils/serialization.js";

const returnRequestSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, index: true },
    reason: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "processed"],
      default: "pending",
    },
    resolutionNote: { type: String, default: "" },
  },
  { timestamps: true }
);

returnRequestSchema.set("toJSON", { transform: toPublicJsonTransform });

export const ReturnRequest = mongoose.model("ReturnRequest", returnRequestSchema);


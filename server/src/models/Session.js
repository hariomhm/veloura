import mongoose from "mongoose";
import { toPublicJsonTransform } from "../utils/serialization.js";

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    tokenHash: { type: String, required: true },
    userAgent: { type: String, default: "" },
    ip: { type: String, default: "" },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
    replacedByToken: { type: String, default: "" },
    lastUsedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

sessionSchema.set("toJSON", { transform: toPublicJsonTransform });

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model("Session", sessionSchema);

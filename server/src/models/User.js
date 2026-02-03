import mongoose from "mongoose";
import { toPublicJsonTransform } from "../utils/serialization.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    provider: { type: String, default: "password" },
    googleId: { type: String, default: "" },
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    toPublicJsonTransform(doc, ret);
    delete ret.passwordHash;
    ret.banned = Boolean(ret.isBanned);
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);

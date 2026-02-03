import mongoose from "mongoose";
import { toPublicJsonTransform } from "../utils/serialization.js";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mrp: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: null },
    category: { type: String, required: true, trim: true },
    gender: {
      type: String,
      required: true,
      enum: ["men", "women", "kids", "unisex"],
    },
    sizes: { type: [String], default: [] },
    imageUrl: { type: [String], default: [] },
    description: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    slug: { type: String, required: true, unique: true, trim: true },
    color: { type: String, default: "" },
    material: { type: String, default: "" },
    pattern: { type: String, default: "" },
    neckType: { type: String, default: "" },
    sleeveLength: { type: String, default: "" },
    washCare: { type: String, default: "" },
    countryOfOrigin: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    productType: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ isActive: 1, isFeatured: 1, gender: 1, category: 1 });
productSchema.index({ name: "text", description: "text" });

productSchema.set("toJSON", {
  transform: (doc, ret) => {
    toPublicJsonTransform(doc, ret);
    ret.images = Array.isArray(ret.imageUrl) ? ret.imageUrl : [];
    ret.productName = ret.name;
    return ret;
  },
});

export const Product = mongoose.model("Product", productSchema);

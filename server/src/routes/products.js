import express from "express";
import { z } from "zod";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { Product } from "../models/Product.js";

export const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  const { isFeatured, isActive, limit, page, pageSize, q } = req.query;
  const filter = {};
  if (isFeatured !== undefined) filter.isFeatured = String(isFeatured) === "true";
  if (isActive !== undefined) filter.isActive = String(isActive) === "true";
  if (q) filter.$text = { $search: String(q) };

  let query = Product.find(filter);
  if (q) {
    query = query
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .select({ score: { $meta: "textScore" } });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const numericPage = Number(page || 0);
  const numericPageSize = Number(pageSize || 0);
  if (numericPageSize > 0) {
    const cappedSize = Math.min(numericPageSize, 100);
    query = query.skip(Math.max(numericPage - 1, 0) * cappedSize).limit(cappedSize);
    const products = await query;
    const total = await Product.countDocuments(filter);
    return res.json({
      items: products.map((p) => p.toJSON()),
      total,
      page: numericPage || 1,
      pageSize: cappedSize,
    });
  }

  if (limit) query.limit(Math.min(Number(limit), 100));
  const products = await query;
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=30");
  return res.json(products.map((p) => p.toJSON()));
});

productsRouter.get("/slug/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=30");
  return res.json(product.toJSON());
});

productsRouter.get("/:productId", async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json(product.toJSON());
});

const productCreateSchema = z.object({
  name: z.string().min(1),
  mrp: z.number().nonnegative(),
  discountPercent: z.number().nullable().optional(),
  category: z.string().min(1),
  gender: z.enum(["men", "women", "kids", "unisex"]),
  sizes: z.array(z.string()).optional(),
  imageUrl: z.array(z.string()).optional(),
  description: z.string().min(1),
  stock: z.number().int().nonnegative(),
  slug: z.string().min(1).optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  pattern: z.string().optional(),
  neckType: z.string().optional(),
  sleeveLength: z.string().optional(),
  washCare: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  productType: z.string().min(1),
});

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

productsRouter.post("/", requireAuth, requireAdmin, async (req, res) => {
  const parsed = productCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const payload = { ...parsed.data };
  if (!payload.slug) payload.slug = slugify(payload.name);

  const product = await Product.create(payload);
  return res.status(201).json(product.toJSON());
});

productsRouter.put("/:productId", requireAuth, requireAdmin, async (req, res) => {
  const parsed = productCreateSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const updates = { ...parsed.data };
  if (updates.name && !updates.slug) {
    updates.slug = slugify(updates.name);
  }

  const product = await Product.findByIdAndUpdate(req.params.productId, updates, {
    new: true,
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json(product.toJSON());
});

productsRouter.delete("/:productId", requireAuth, requireAdmin, async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.productId);
  if (!deleted) return res.status(404).json({ message: "Product not found" });
  return res.json({ ok: true });
});

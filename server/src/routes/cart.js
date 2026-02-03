import express from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { Cart } from "../models/Cart.js";
import { normalizeCartItems } from "../services/pricingService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const cartRouter = express.Router();

const getCartForUser = async (userId, res) => {
  const cart = await Cart.findOne({ userId }).lean();
  return res.json({ items: cart?.items || [] });
};

cartRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    return getCartForUser(req.auth.userId, res);
  })
);

cartRouter.get(
  "/:userId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const isSelf = req.auth.userId === userId;
    const isAdmin = req.auth.role === "admin";
    if (!isSelf && !isAdmin) return res.status(403).json({ message: "Forbidden" });
    return getCartForUser(userId, res);
  })
);

const saveSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      size: z.string().nullable().optional(),
    })
  ),
});

const saveCartForUser = async (userId, items, res) => {
  const normalized = await normalizeCartItems(items);
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { items: normalized.items },
    { upsert: true, new: true }
  );
  return res.json(cart.toJSON());
};

cartRouter.put(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = saveSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });
    return saveCartForUser(req.auth.userId, parsed.data.items, res);
  })
);

cartRouter.put(
  "/:userId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const isSelf = req.auth.userId === userId;
    const isAdmin = req.auth.role === "admin";
    if (!isSelf && !isAdmin) return res.status(403).json({ message: "Forbidden" });

    const parsed = saveSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    return saveCartForUser(userId, parsed.data.items, res);
  })
);

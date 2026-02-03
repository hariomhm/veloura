import express from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { Wishlist } from "../models/Wishlist.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const wishlistRouter = express.Router();

const getWishlistForUser = async (userId, res) => {
  const wishlist = await Wishlist.findOne({ userId }).lean();
  return res.json({ items: wishlist?.items || [] });
};

wishlistRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    return getWishlistForUser(req.auth.userId, res);
  })
);

wishlistRouter.get(
  "/:userId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const isSelf = req.auth.userId === userId;
    const isAdmin = req.auth.role === "admin";
    if (!isSelf && !isAdmin) return res.status(403).json({ message: "Forbidden" });
    return getWishlistForUser(userId, res);
  })
);

const addSchema = z.object({ productId: z.string().min(1) });

const addWishlistForUser = async (userId, productId, res) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    { $addToSet: { items: productId } },
    { upsert: true, new: true }
  );
  return res.json(wishlist.toJSON());
};

wishlistRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = addSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });
    return addWishlistForUser(req.auth.userId, parsed.data.productId, res);
  })
);

wishlistRouter.post(
  "/:userId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const isSelf = req.auth.userId === userId;
    const isAdmin = req.auth.role === "admin";
    if (!isSelf && !isAdmin) return res.status(403).json({ message: "Forbidden" });

    const parsed = addSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    return addWishlistForUser(userId, parsed.data.productId, res);
  })
);

const removeWishlistForUser = async (userId, productId, res) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    { $pull: { items: productId } },
    { upsert: true, new: true }
  );
  return res.json(wishlist.toJSON());
};

wishlistRouter.delete(
  "/:productId",
  requireAuth,
  asyncHandler(async (req, res) => {
    return removeWishlistForUser(req.auth.userId, req.params.productId, res);
  })
);

wishlistRouter.delete(
  "/:userId/:productId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId, productId } = req.params;
    const isSelf = req.auth.userId === userId;
    const isAdmin = req.auth.role === "admin";
    if (!isSelf && !isAdmin) return res.status(403).json({ message: "Forbidden" });
    return removeWishlistForUser(userId, productId, res);
  })
);

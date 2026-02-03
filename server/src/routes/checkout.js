import express from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { CheckoutSession } from "../models/CheckoutSession.js";
import { env } from "../config/env.js";
import { normalizeCartItems, validateCoupon } from "../services/pricingService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const checkoutRouter = express.Router();

const quoteSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
      size: z.string().nullable().optional(),
    })
  ).min(1),
  couponCode: z.string().optional(),
  currency: z.string().optional(),
});

checkoutRouter.post(
  "/quote",
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = quoteSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const { items, couponCode, currency } = parsed.data;
    const { items: normalized, subtotal } = await normalizeCartItems(items);
    const { coupon, discountTotal } = await validateCoupon(
      couponCode,
      subtotal,
      req.auth.userId
    );

    const total = Math.max(0, subtotal - discountTotal);
    const expiresAt = new Date(Date.now() + env.checkoutTtlMinutes * 60 * 1000);

    const checkout = await CheckoutSession.create({
      userId: req.auth.userId,
      items: normalized,
      subtotal,
      discountTotal,
      total,
      couponCode: coupon?.code || "",
      currency: currency || "INR",
      expiresAt,
    });

    return res.json({
      checkoutId: checkout._id.toString(),
      items: checkout.items,
      subtotal: checkout.subtotal,
      discountTotal: checkout.discountTotal,
      total: checkout.total,
      currency: checkout.currency,
      couponCode: checkout.couponCode,
      expiresAt: checkout.expiresAt,
    });
  })
);

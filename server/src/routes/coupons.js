import express from "express";
import { z } from "zod";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { Coupon } from "../models/Coupon.js";
import { normalizeCartItems, validateCoupon } from "../services/pricingService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const couponsRouter = express.Router();

const couponSchema = z.object({
  code: z.string().min(3),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().positive(),
  minOrderValue: z.number().nonnegative().optional(),
  maxDiscount: z.number().nonnegative().optional(),
  active: z.boolean().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  usageLimit: z.number().int().positive().optional(),
  perUserLimit: z.number().int().positive().optional(),
});

couponsRouter.post(
  "/validate",
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        items: z.array(
          z.object({
            productId: z.string().min(1),
            quantity: z.number().int().positive(),
            size: z.string().nullable().optional(),
          })
        ),
        couponCode: z.string().min(1),
      })
      .safeParse(req.body);

    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const { items, subtotal } = await normalizeCartItems(parsed.data.items);
    const { coupon, discountTotal } = await validateCoupon(
      parsed.data.couponCode,
      subtotal,
      req.auth.userId
    );
    const total = Math.max(0, subtotal - discountTotal);

    return res.json({
      coupon: coupon?.toJSON(),
      subtotal,
      discountTotal,
      total,
    });
  })
);

couponsRouter.get("/", requireAuth, requireAdmin, asyncHandler(async (_req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons.map((c) => c.toJSON()));
}));

couponsRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const parsed = couponSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const payload = {
      ...parsed.data,
      code: parsed.data.code.toUpperCase(),
      startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : null,
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
    };
    const coupon = await Coupon.create(payload);
    res.status(201).json(coupon.toJSON());
  })
);

couponsRouter.put(
  "/:couponId",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const parsed = couponSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const updates = {
      ...parsed.data,
      code: parsed.data.code ? parsed.data.code.toUpperCase() : undefined,
      startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : undefined,
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : undefined,
    };

    const coupon = await Coupon.findByIdAndUpdate(req.params.couponId, updates, {
      new: true,
    });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon.toJSON());
  })
);

couponsRouter.delete(
  "/:couponId",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.couponId,
      { active: false },
      { new: true }
    );
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon.toJSON());
  })
);

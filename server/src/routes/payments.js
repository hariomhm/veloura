import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { z } from "zod";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";
import { CheckoutSession } from "../models/CheckoutSession.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const paymentsRouter = express.Router();

const getRazorpay = () => {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) return null;
  return new Razorpay({ key_id: env.razorpayKeyId, key_secret: env.razorpayKeySecret });
};

paymentsRouter.post(
  "/create-order",
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = z.object({ checkoutId: z.string().min(1) }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const checkout = await CheckoutSession.findOne({
      _id: parsed.data.checkoutId,
      userId: req.auth.userId,
      status: "pending",
    });
    if (!checkout) return res.status(404).json({ message: "Checkout session not found" });
    if (checkout.expiresAt < new Date()) {
      return res.status(400).json({ message: "Checkout session expired" });
    }

    const razorpay = getRazorpay();
    if (!razorpay) return res.status(500).json({ message: "Razorpay is not configured" });

    const order = await razorpay.orders.create({
      amount: Math.round(checkout.total * 100),
      currency: checkout.currency,
    });

    checkout.paymentOrderId = order.id;
    checkout.paymentProvider = "razorpay";
    await checkout.save();

    return res.json({
      order,
      checkoutId: checkout._id.toString(),
      amount: checkout.total,
      currency: checkout.currency,
    });
  })
);

paymentsRouter.post(
  "/verify",
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        paymentId: z.string().min(1),
        orderId: z.string().min(1),
        signature: z.string().min(1),
      })
      .safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    if (!env.razorpayKeySecret) return res.status(500).json({ message: "Razorpay is not configured" });

    const body = `${parsed.data.orderId}|${parsed.data.paymentId}`;
    const expected = crypto.createHmac("sha256", env.razorpayKeySecret).update(body).digest("hex");
    if (expected !== parsed.data.signature) return res.status(400).json({ message: "Invalid signature" });

    return res.json({ ok: true });
  })
);

// Stripe-ready (mock) endpoint for future integration
paymentsRouter.post(
  "/stripe-intent",
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = z.object({ checkoutId: z.string().min(1) }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const checkout = await CheckoutSession.findOne({
      _id: parsed.data.checkoutId,
      userId: req.auth.userId,
      status: "pending",
    });
    if (!checkout) return res.status(404).json({ message: "Checkout session not found" });

    return res.json({
      provider: "stripe",
      clientSecret: "mock_client_secret",
      amount: checkout.total,
      currency: checkout.currency,
    });
  })
);

import express from "express";
import crypto from "crypto";
import { z } from "zod";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { Order } from "../models/Order.js";
import { CheckoutSession } from "../models/CheckoutSession.js";
import { finalizeCheckout } from "../services/orderService.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const ordersRouter = express.Router();

const confirmSchema = z.object({
  checkoutId: z.string().min(1),
  paymentId: z.string().min(1),
  orderId: z.string().min(1),
  signature: z.string().min(1),
  provider: z.string().optional(),
  status: z.enum(["paid", "pending"]).optional(),
  shipping: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
      addressLine: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
    })
    .optional(),
});

const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  if (!env.razorpayKeySecret) return true;
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", env.razorpayKeySecret).update(body).digest("hex");
  return expected === signature;
};

const handleConfirm = async (req, res) => {
  const parsed = confirmSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const { checkoutId, paymentId, orderId, signature, provider, status, shipping } = parsed.data;

  const checkout = await CheckoutSession.findOne({
    _id: checkoutId,
    userId: req.auth.userId,
    status: "pending",
  });
  if (!checkout) return res.status(404).json({ message: "Checkout session not found" });

  if (checkout.paymentOrderId && checkout.paymentOrderId !== orderId) {
    return res.status(400).json({ message: "Payment order mismatch" });
  }

  if (provider !== "stripe") {
    const ok = verifyRazorpaySignature({ orderId, paymentId, signature });
    if (!ok) return res.status(400).json({ message: "Invalid payment signature" });
  }

  const order = await finalizeCheckout({
    checkoutId,
    userId: req.auth.userId,
    payment: {
      paymentId,
      orderId,
      provider: provider || "razorpay",
      status: status || "paid",
    },
    shipping: shipping || {},
  });

  return res.status(201).json(order.toJSON());
};

ordersRouter.post("/confirm", requireAuth, asyncHandler(handleConfirm));

ordersRouter.post("/", requireAuth, asyncHandler(handleConfirm));

ordersRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = String(req.query.userId || req.auth.userId || "");
    if (!userId) return res.status(400).json({ message: "Missing userId" });

    const isSelf = req.auth.userId === userId;
    const isAdmin = req.auth.role === "admin";
    if (!isSelf && !isAdmin) return res.status(403).json({ message: "Forbidden" });

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.json(orders.map((o) => o.toJSON()));
  })
);

ordersRouter.get(
  "/admin",
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders.map((o) => o.toJSON()));
  })
);

ordersRouter.get(
  "/:orderId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isSelf = req.auth.userId === order.userId;
    const isAdmin = req.auth.role === "admin";
    if (!isSelf && !isAdmin) return res.status(403).json({ message: "Forbidden" });

    return res.json(order.toJSON());
  })
);

const statusSchema = z.object({
  status: z.enum(["pending", "paid", "shipped", "delivered"]),
});

ordersRouter.put(
  "/:orderId/status",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: parsed.data.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order.toJSON());
  })
);

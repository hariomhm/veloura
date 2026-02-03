import express from "express";
import { z } from "zod";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { ReturnRequest } from "../models/ReturnRequest.js";
import { Order } from "../models/Order.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const returnsRouter = express.Router();

const createSchema = z.object({
  orderId: z.string().min(1),
  reason: z.string().min(3),
  description: z.string().max(1000).optional(),
});

returnsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const order = await Order.findById(parsed.data.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (String(order.userId) !== req.auth.userId && req.auth.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const request = await ReturnRequest.create({
      userId: req.auth.userId,
      orderId: parsed.data.orderId,
      reason: parsed.data.reason,
      description: parsed.data.description || "",
    });

    res.status(201).json(request.toJSON());
  })
);

returnsRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const requests = await ReturnRequest.find({ userId: req.auth.userId }).sort({
      createdAt: -1,
    });
    res.json(requests.map((r) => r.toJSON()));
  })
);

returnsRouter.get(
  "/admin",
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const requests = await ReturnRequest.find().sort({ createdAt: -1 });
    res.json(requests.map((r) => r.toJSON()));
  })
);

returnsRouter.put(
  "/:returnId/status",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({
        status: z.enum(["pending", "approved", "rejected", "processed"]),
        resolutionNote: z.string().max(1000).optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const updated = await ReturnRequest.findByIdAndUpdate(
      req.params.returnId,
      {
        status: parsed.data.status,
        resolutionNote: parsed.data.resolutionNote || "",
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Return request not found" });
    res.json(updated.toJSON());
  })
);


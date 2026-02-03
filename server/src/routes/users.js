import express from "express";
import { z } from "zod";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { User } from "../models/User.js";

export const usersRouter = express.Router();

usersRouter.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  return res.json(users.map((u) => u.toJSON()));
});

usersRouter.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.auth.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user.toJSON());
});

usersRouter.get("/:userId", requireAuth, async (req, res) => {
  const { userId } = req.params;
  const isSelf = req.auth.userId === userId;
  const isAdmin = req.auth.role === "admin";
  if (!isSelf && !isAdmin) return res.status(403).json({ message: "Forbidden" });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user.toJSON());
});

const updateSchema = z.object({
  name: z.string().max(120).optional(),
  phone: z.string().max(30).optional(),
  address: z.string().max(500).optional(),

  role: z.enum(["user", "admin"]).optional(),
  isBanned: z.boolean().optional(),
  banReason: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

usersRouter.put("/me", requireAuth, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const updates = { ...parsed.data };
  delete updates.role;
  delete updates.isBanned;
  delete updates.banReason;
  delete updates.isActive;

  const user = await User.findByIdAndUpdate(req.auth.userId, updates, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user.toJSON());
});

usersRouter.put("/:userId", requireAuth, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const { userId } = req.params;
  const isSelf = req.auth.userId === userId;
  const isAdmin = req.auth.role === "admin";
  if (!isSelf && !isAdmin) return res.status(403).json({ message: "Forbidden" });

  const updates = { ...parsed.data };

  if (!isAdmin) {
    delete updates.role;
    delete updates.isBanned;
    delete updates.banReason;
    delete updates.isActive;
  }

  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user.toJSON());
});

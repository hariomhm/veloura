import express from "express";
import { nanoid } from "nanoid";
import { z } from "zod";
import { NewsletterSubscription } from "../models/NewsletterSubscription.js";

export const newsletterRouter = express.Router();

newsletterRouter.post("/subscribe", async (req, res) => {
  const parsed = z.object({ email: z.string().email() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const email = parsed.data.email.toLowerCase().trim();
  const token = nanoid(32);

  const sub = await NewsletterSubscription.findOneAndUpdate(
    { email },
    { email, token, status: "pending" },
    { upsert: true, new: true }
  );

  // In a real app, email `token` to the user.
  return res.json({ ok: true, token: sub.token });
});

newsletterRouter.post("/verify", async (req, res) => {
  const parsed = z.object({ token: z.string().min(10) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const sub = await NewsletterSubscription.findOneAndUpdate(
    { token: parsed.data.token },
    { status: "verified" },
    { new: true }
  );
  if (!sub) return res.status(404).json({ message: "Invalid token" });
  return res.json({ ok: true });
});

newsletterRouter.post("/unsubscribe", async (req, res) => {
  const parsed = z.object({ token: z.string().min(10) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const sub = await NewsletterSubscription.findOneAndUpdate(
    { token: parsed.data.token },
    { status: "unsubscribed" },
    { new: true }
  );
  if (!sub) return res.status(404).json({ message: "Invalid token" });
  return res.json({ ok: true });
});


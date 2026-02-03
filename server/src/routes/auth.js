import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { Session } from "../models/Session.js";
import { requireAuth } from "../middleware/auth.js";
import { authRateLimiter } from "../middleware/rateLimit.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { issueCsrfToken } from "../middleware/csrf.js";
import {
  clearAuthCookies,
  hashToken,
  setAuthCookies,
  signAccessToken,
  signRefreshToken,
} from "../utils/tokens.js";

export const authRouter = express.Router();

const googleClient = env.googleClientId ? new OAuth2Client(env.googleClientId) : null;

const registerSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(200),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
});

const googleSchema = z.object({
  idToken: z.string().min(10),
});

const createSession = async (user, req) => {
  if (env.maxSessionsPerUser === 1) {
    await Session.updateMany({ userId: user._id.toString(), revokedAt: null }, { revokedAt: new Date() });
  }

  const expiresAt = new Date(Date.now() + env.jwtRefreshTtlMs);
  const session = await Session.create({
    userId: user._id.toString(),
    tokenHash: "pending",
    userAgent: req.get("user-agent") || "",
    ip: req.ip,
    expiresAt,
  });

  const sessionId = session._id.toString();
  const accessToken = signAccessToken(user, sessionId);
  const refreshToken = signRefreshToken(user, sessionId);

  session.tokenHash = hashToken(refreshToken);
  await session.save();

  return { accessToken, refreshToken };
};

const rotateRefreshToken = async (refreshToken) => {
  const payload = jwt.verify(refreshToken, env.jwtRefreshSecret || env.jwtSecret);
  const userId = String(payload.sub || "");
  const sessionId = String(payload.sid || "");
  if (!userId || !sessionId) {
    throw new Error("Invalid refresh token");
  }

  const session = await Session.findById(sessionId);
  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    throw new Error("Session expired");
  }
  if (String(session.userId) !== userId) {
    throw new Error("Session mismatch");
  }

  if (session.tokenHash !== hashToken(refreshToken)) {
    session.revokedAt = new Date();
    await session.save();
    throw new Error("Refresh token reuse detected");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.isBanned) throw new Error("User is banned");
  if (user.isActive === false) throw new Error("User is inactive");

  const newAccessToken = signAccessToken(user, sessionId);
  const newRefreshToken = signRefreshToken(user, sessionId);
  session.tokenHash = hashToken(newRefreshToken);
  session.lastUsedAt = new Date();
  await session.save();

  return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
};

authRouter.use(authRateLimiter);

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const email = parsed.data.email.toLowerCase().trim();
    const existing = await User.findOne({ email }).lean();
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await User.create({
      email,
      passwordHash,
      name: parsed.data.name,
    });

    const { accessToken, refreshToken } = await createSession(user, req);
    setAuthCookies(res, { accessToken, refreshToken });
    issueCsrfToken(res);

    return res.status(201).json({ user: user.toJSON() });
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

    const email = parsed.data.email.toLowerCase().trim();
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (user.isBanned) return res.status(403).json({ message: "User is banned" });
    if (user.isActive === false) return res.status(403).json({ message: "User is inactive" });

    const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = await createSession(user, req);
    setAuthCookies(res, { accessToken, refreshToken });
    issueCsrfToken(res);

    return res.json({ user: user.toJSON() });
  })
);

authRouter.post(
  "/google",
  asyncHandler(async (req, res) => {
    const parsed = googleSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });
    if (!googleClient) return res.status(500).json({ message: "Google OAuth not configured" });

    const ticket = await googleClient.verifyIdToken({
      idToken: parsed.data.idToken,
      audience: env.googleClientId,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(400).json({ message: "Invalid Google token" });

    const email = payload.email.toLowerCase().trim();
    let user = await User.findOne({ email });
    if (!user) {
      const passwordHash = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12);
      user = await User.create({
        email,
        name: payload.name || "",
        passwordHash,
        provider: "google",
        googleId: payload.sub || "",
      });
    }

    if (user.isBanned) return res.status(403).json({ message: "User is banned" });
    if (user.isActive === false) return res.status(403).json({ message: "User is inactive" });

    const { accessToken, refreshToken } = await createSession(user, req);
    setAuthCookies(res, { accessToken, refreshToken });
    issueCsrfToken(res);

    return res.json({ user: user.toJSON() });
  })
);

authRouter.get(
  "/session",
  asyncHandler(async (req, res) => {
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    if (accessToken) {
      try {
        const payload = jwt.verify(accessToken, env.jwtSecret);
        const userId = String(payload.sub || "");
        const sessionId = String(payload.sid || "");
        if (sessionId) {
          const session = await Session.findById(sessionId).lean();
          if (!session || session.revokedAt || session.expiresAt < new Date()) {
            throw new Error("Session expired");
          }
        }
        const user = await User.findById(userId);
        if (!user) return res.status(401).json({ message: "Unauthorized" });
        if (user.isBanned) return res.status(403).json({ message: "User is banned" });
        if (user.isActive === false) return res.status(403).json({ message: "User is inactive" });
        issueCsrfToken(res);
        return res.json({ user: user.toJSON() });
      } catch (_err) {
        // fall through to refresh
      }
    }

    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

    try {
      const { user, accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await rotateRefreshToken(refreshToken);
      setAuthCookies(res, { accessToken: newAccessToken, refreshToken: newRefreshToken });
      issueCsrfToken(res);
      return res.json({ user: user.toJSON() });
    } catch (_err) {
      clearAuthCookies(res);
      return res.status(401).json({ message: "Unauthorized" });
    }
  })
);

authRouter.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

    try {
      const { user, accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await rotateRefreshToken(refreshToken);
      setAuthCookies(res, { accessToken: newAccessToken, refreshToken: newRefreshToken });
      issueCsrfToken(res);
      return res.json({ user: user.toJSON() });
    } catch (_err) {
      clearAuthCookies(res);
      return res.status(401).json({ message: "Unauthorized" });
    }
  })
);

authRouter.post(
  "/logout",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (req.auth.sessionId) {
      await Session.findByIdAndUpdate(req.auth.sessionId, { revokedAt: new Date() });
    }
    clearAuthCookies(res);
    return res.json({ ok: true });
  })
);

authRouter.post(
  "/logout-all",
  requireAuth,
  asyncHandler(async (req, res) => {
    await Session.updateMany({ userId: req.auth.userId, revokedAt: null }, { revokedAt: new Date() });
    clearAuthCookies(res);
    return res.json({ ok: true });
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.auth.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user.toJSON());
  })
);

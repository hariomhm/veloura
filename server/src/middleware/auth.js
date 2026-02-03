import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { Session } from "../models/Session.js";

const getAccessToken = (req) => {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type === "Bearer" && token) return token;
  const cookieToken = req.cookies?.access_token;
  return cookieToken || null;
};

export const requireAuth = async (req, res, next) => {
  try {
    const token = getAccessToken(req);
    if (!token) return res.status(401).json({ message: "Missing token" });

    const payload = jwt.verify(token, env.jwtSecret);
    const userId = String(payload.sub || payload.userId || "");
    const sessionId = String(payload.sid || "");
    if (!userId) return res.status(401).json({ message: "Invalid token" });

    if (sessionId) {
      const session = await Session.findById(sessionId).lean();
      if (!session || session.revokedAt || session.expiresAt < new Date()) {
        return res.status(401).json({ message: "Session expired" });
      }
    }

    const user = await User.findById(userId).lean();
    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.isBanned) return res.status(403).json({ message: "User is banned" });
    if (user.isActive === false) return res.status(403).json({ message: "User is inactive" });

    req.auth = {
      token,
      userId,
      role: user.role,
      sessionId,
    };
    next();
  } catch (_err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.auth) return res.status(401).json({ message: "Unauthorized" });
  if (req.auth.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
};

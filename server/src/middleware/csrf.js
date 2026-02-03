import crypto from "crypto";
import { env } from "../config/env.js";

const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";

const isSafeMethod = (method) => ["GET", "HEAD", "OPTIONS"].includes(method);

const shouldSkip = (req) => {
  if (isSafeMethod(req.method)) return true;
  const skip = ["/auth/login", "/auth/register", "/auth/google"];
  if (skip.includes(req.path)) return true;
  // If using Authorization header, treat as non-cookie auth and skip CSRF.
  if (req.headers.authorization) return true;
  return false;
};

export const issueCsrfToken = (res) => {
  const token = crypto.randomBytes(32).toString("hex");
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    domain: env.cookieDomain || undefined,
    path: "/",
  });
  return token;
};

export const csrfProtection = (req, res, next) => {
  if (shouldSkip(req)) return next();
  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.headers[CSRF_HEADER];
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }
  return next();
};


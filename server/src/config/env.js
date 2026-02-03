import dotenv from "dotenv";

dotenv.config();

const required = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const toNumber = (value, fallback) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const toBool = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

const parseDuration = (value, fallbackMs) => {
  if (!value) return fallbackMs;
  const raw = String(value).trim();
  const match = raw.match(/^(\d+)(ms|s|m|h|d)?$/i);
  if (!match) return fallbackMs;
  const amount = Number(match[1]);
  const unit = (match[2] || "s").toLowerCase();
  switch (unit) {
    case "ms":
      return amount;
    case "s":
      return amount * 1000;
    case "m":
      return amount * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    case "d":
      return amount * 24 * 60 * 60 * 1000;
    default:
      return fallbackMs;
  }
};

const parseOrigins = (value, fallback) => {
  const raw = value || fallback;
  return String(raw)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const nodeEnv = process.env.NODE_ENV || "development";
const jwtAccessTtl = process.env.JWT_ACCESS_TTL || "15m";
const jwtRefreshTtl = process.env.JWT_REFRESH_TTL || "30d";

export const env = {
  nodeEnv,
  port: toNumber(process.env.PORT, 5000),
  mongoUri: required("MONGODB_URI"),
  jwtSecret: required("JWT_SECRET"),
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
  jwtAccessTtl,
  jwtRefreshTtl,
  jwtAccessTtlMs: parseDuration(jwtAccessTtl, 15 * 60 * 1000),
  jwtRefreshTtlMs: parseDuration(jwtRefreshTtl, 30 * 24 * 60 * 60 * 1000),
  clientOrigins: parseOrigins(process.env.CLIENT_ORIGIN, "http://127.0.0.1:27017"),
  siteUrl: process.env.SITE_URL || process.env.CLIENT_ORIGIN || "http://127.0.0.1:27017",
  cookieDomain: process.env.COOKIE_DOMAIN || "",
  cookieSecure: toBool(process.env.COOKIE_SECURE, nodeEnv === "production"),
  cookieSameSite: process.env.COOKIE_SAMESITE || "lax",
  maxSessionsPerUser: toNumber(process.env.MAX_SESSIONS_PER_USER, 1),
  checkoutTtlMinutes: toNumber(process.env.CHECKOUT_TTL_MINUTES, 15),
  rateLimitWindowMs: parseDuration(process.env.RATE_LIMIT_WINDOW || "15m", 15 * 60 * 1000),
  rateLimitMax: toNumber(process.env.RATE_LIMIT_MAX, 200),
  authRateLimitMax: toNumber(process.env.AUTH_RATE_LIMIT_MAX, 10),
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
};

import pino from "pino";
import pinoHttp from "pino-http";
import { env } from "../config/env.js";

const isProd = env.nodeEnv === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
  redact: ["req.headers.authorization", "req.headers.cookie"],
});

export const requestLogger = pinoHttp({
  logger,
  customLogLevel: (res, err) => {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
});


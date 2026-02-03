import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export const errorHandler = (err, _req, res, _next) => {
  const status = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal server error";

  if (status >= 500) {
    logger.error({ err }, "Unhandled error");
  }

  res.status(status).json({
    message,
    code: err.code || "SERVER_ERROR",
  });
};


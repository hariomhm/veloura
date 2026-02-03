import express from "express";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import compression from "compression";
import { env } from "./config/env.js";
import { requestLogger } from "./utils/logger.js";
import { apiRateLimiter } from "./middleware/rateLimit.js";
import { csrfProtection } from "./middleware/csrf.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { sanitizeRequest } from "./middleware/sanitize.js";
import { authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";
import { productsRouter } from "./routes/products.js";
import { cartRouter } from "./routes/cart.js";
import { wishlistRouter } from "./routes/wishlist.js";
import { ordersRouter } from "./routes/orders.js";
import { paymentsRouter } from "./routes/payments.js";
import { newsletterRouter } from "./routes/newsletter.js";
import { uploadsRouter } from "./routes/uploads.js";
import { checkoutRouter } from "./routes/checkout.js";
import { couponsRouter } from "./routes/coupons.js";
import { returnsRouter } from "./routes/returns.js";
import { seoRouter } from "./routes/seo.js";

export const createApp = () => {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(requestLogger);
  app.use(apiRateLimiter);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(
    cors({
      origin: env.clientOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    })
  );
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(mongoSanitize());
  app.use(sanitizeRequest);
  app.use(hpp());
  app.use(csrfProtection);

  app.get("/health", (_req, res) => res.json({ ok: true }));

  // Static uploads
  const uploadsPath = path.resolve(process.cwd(), "uploads");
  app.use(
    "/uploads",
    express.static(uploadsPath, { maxAge: "7d", immutable: true })
  );

  app.use("/", seoRouter);
  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/products", productsRouter);
  app.use("/carts", cartRouter);
  app.use("/wishlist", wishlistRouter);
  app.use("/orders", ordersRouter);
  app.use("/checkout", checkoutRouter);
  app.use("/payments", paymentsRouter);
  app.use("/coupons", couponsRouter);
  app.use("/returns", returnsRouter);
  app.use("/newsletter", newsletterRouter);
  app.use("/uploads", uploadsRouter);

  app.use((req, res) => res.status(404).json({ message: "Not found" }));
  app.use(errorHandler);

  return app;
};

import fs from "fs";
import path from "path";
import { connectDb } from "./db/connectDb.js";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const ensureUploadsDir = () => {
  fs.mkdirSync(path.resolve(process.cwd(), "uploads"), { recursive: true });
};

const main = async () => {
  ensureUploadsDir();
  await connectDb();

  const app = createApp();
  app.listen(env.port, () => {
    logger.info(`API listening on http://localhost:${env.port}`);
  });
};

main().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});

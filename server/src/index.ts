import mongoose from "mongoose";

import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { logger } from "./lib/logger.js";
import { cloudinaryConfigured, verifyCloudinary } from "./services/cloudinary.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`[server] listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info("[database] connected");
  } catch (error) {
    logger.error({ err: error }, "[database] connection failed");
    logger.warn("[database] continuing without a database connection (M1 will require it)");
  }
}

async function verifyMediaStorage(): Promise<void> {
  if (!cloudinaryConfigured()) {
    logger.warn("[media] Cloudinary credentials missing; media uploads disabled");
    return;
  }
  try {
    await verifyCloudinary();
    logger.info("[media] Cloudinary connected");
  } catch (error) {
    logger.error({ err: error }, "[media] Cloudinary verification failed");
  }
}

async function shutdown(signal: string): Promise<void> {
  logger.info(`[server] received ${signal}, shutting down`);
  server.close();
  await mongoose.disconnect().catch(() => undefined);
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

void (async () => {
  await connectDatabase();
  await verifyMediaStorage();
})();

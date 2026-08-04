import mongoose from "mongoose";

import { env } from "../config/env.js";
import { cloudinaryConfigured, verifyCloudinary } from "../services/cloudinary.js";
import { ensureAdmin } from "./adminSeed.js";
import { logger } from "./logger.js";

let bootstrapPromise: Promise<void> | undefined;

export function bootstrap(): Promise<void> {
  bootstrapPromise ??= (async () => {
    await connectDatabase();
    await seedAdmin();
    await verifyMediaStorage();
  })();
  return bootstrapPromise;
}

async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info("[database] connected");
  } catch (error) {
    logger.error({ err: error }, "[database] connection failed");
    logger.warn("[database] continuing without a database connection (API will require it)");
  }
}

async function seedAdmin(): Promise<void> {
  try {
    await ensureAdmin();
  } catch (error) {
    logger.error({ err: error }, "[seed] admin seed failed");
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

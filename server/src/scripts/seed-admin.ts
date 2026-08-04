import mongoose from "mongoose";

import { env } from "../config/env.js";
import { ensureAdmin } from "../lib/adminSeed.js";
import { logger } from "../lib/logger.js";

async function seedAdmin(): Promise<void> {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    logger.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env to seed the admin user");
    process.exit(1);
  }

  await mongoose.connect(env.MONGODB_URI);
  await ensureAdmin();
  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err: unknown) => {
  logger.error({ err }, "[seed] admin seed failed");
  process.exit(1);
});

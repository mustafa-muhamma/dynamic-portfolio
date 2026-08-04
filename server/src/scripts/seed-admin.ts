import mongoose from "mongoose";

import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";
import { hashPassword } from "../lib/password.js";
import { AdminModel } from "../models/admin.model.js";

async function seedAdmin(): Promise<void> {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    logger.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env to seed the admin user");
    process.exit(1);
  }

  await mongoose.connect(env.MONGODB_URI);
  const passwordHash = await hashPassword(env.ADMIN_PASSWORD);

  const existing = await AdminModel.findOne({ email: env.ADMIN_EMAIL });
  if (existing) {
    existing.passwordHash = passwordHash;
    await existing.save();
    logger.info(`[seed] admin ${env.ADMIN_EMAIL} updated`);
  } else {
    await AdminModel.create({ email: env.ADMIN_EMAIL, passwordHash });
    logger.info(`[seed] admin ${env.ADMIN_EMAIL} created`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err: unknown) => {
  logger.error({ err }, "[seed] admin seed failed");
  process.exit(1);
});

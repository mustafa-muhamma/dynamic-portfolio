import { env } from "../config/env.js";
import { logger } from "./logger.js";
import { hashPassword } from "./password.js";
import { AdminModel } from "../models/admin.model.js";

export async function ensureAdmin(): Promise<void> {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    logger.warn("[seed] ADMIN_EMAIL/ADMIN_PASSWORD not set; skipping admin seed");
    return;
  }

  const passwordHash = await hashPassword(env.ADMIN_PASSWORD);
  const existing = await AdminModel.findOne({ email: env.ADMIN_EMAIL });

  if (existing) {
    existing.passwordHash = passwordHash;
    await existing.save();
    logger.info(`[seed] admin ${env.ADMIN_EMAIL} password refreshed`);
  } else {
    await AdminModel.create({ email: env.ADMIN_EMAIL, passwordHash });
    logger.info(`[seed] admin ${env.ADMIN_EMAIL} created`);
  }
}

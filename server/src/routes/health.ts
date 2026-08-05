import mongoose from "mongoose";
import { Router } from "express";

import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

const router = Router();

const DB_STATES: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting"
};

async function pingDatabase(): Promise<boolean> {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) return false;
  try {
    await Promise.race([
      mongoose.connection.db.admin().command({ ping: 1 }),
      new Promise<never>((_, reject) => {
        const timer = setTimeout(() => reject(new Error("ping timed out")), 3000);
        timer.unref?.();
      })
    ]);
    return true;
  } catch (error) {
    logger.warn({ err: error }, "[health] database ping failed");
    return false;
  }
}

router.get("/health", async (_req, res) => {
  const readyState = mongoose.connection.readyState;
  const dbOk = readyState === 1 && (await pingDatabase());

  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? "ok" : "degraded",
    service: "portfolio-server",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: {
      state: DB_STATES[readyState] ?? "unknown",
      readyState,
      ok: dbOk
    }
  });
});

export default router;

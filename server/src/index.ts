import mongoose from "mongoose";

import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { bootstrap } from "./lib/bootstrap.js";
import { logger } from "./lib/logger.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`[server] listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

async function shutdown(signal: string): Promise<void> {
  logger.info(`[server] received ${signal}, shutting down`);
  server.close();
  await mongoose.disconnect().catch(() => undefined);
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

void bootstrap();

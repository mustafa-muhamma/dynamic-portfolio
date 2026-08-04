import mongoose from "mongoose";

import { env } from "./config/env.js";
import { createApp } from "./app.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`[server] listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("[database] connected");
  } catch (error) {
    console.error("[database] connection failed:", error);
    console.warn("[database] continuing without a database connection (M1 will require it)");
  }
}

async function shutdown(signal: string): Promise<void> {
  console.log(`[server] received ${signal}, shutting down`);
  server.close();
  await mongoose.disconnect().catch(() => undefined);
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

void connectDatabase();

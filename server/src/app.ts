import cors from "cors";
import express, { type Express } from "express";

import { env } from "./config/env.js";
import healthRouter from "./routes/health.js";

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(express.json({ limit: "1mb" }));

  app.use("/api/v1", healthRouter);

  app.use((_req, res) => {
    res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Resource not found"
      }
    });
  });

  return app;
}

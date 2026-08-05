import cors from "cors";
import express, { type Express, type NextFunction, type Request, type Response } from "express";

import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { requestLogger } from "./middleware/requestLogger.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import healthRouter from "./routes/health.js";
import { mediaRouter } from "./routes/media.js";
import publicRouter from "./routes/public.js";

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(requestLogger);

  app.use("/api/v1", healthRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1", publicRouter);
  app.use("/api/v1/admin", adminRouter);
  app.use("/api/v1", mediaRouter);

  app.get("/", (_req, res) => {
    res.redirect("/api/v1/health");
  });

  app.use((_req, res) => {
    res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Resource not found"
      }
    });
  });

  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err, method: req.method, url: req.originalUrl }, "unhandled error");
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error"
      }
    });
  });

  return app;
}

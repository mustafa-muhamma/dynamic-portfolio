import type { Request, Response } from "express";

import { signAccessToken } from "../lib/jwt.js";
import { verifyPassword } from "../lib/password.js";
import { logger } from "../lib/logger.js";
import type { AuthedRequest } from "../middleware/auth.js";
import { AdminModel } from "../models/admin.model.js";
import { loginSchema } from "../validation/auth.js";

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid login payload",
        details: parsed.error.flatten().fieldErrors
      }
    });
    return;
  }

  const admin = await AdminModel.findOne({ email: parsed.data.email }).lean();
  if (!admin || !(await verifyPassword(parsed.data.password, admin.passwordHash))) {
    logger.warn({ email: parsed.data.email }, "login failed");
    res.status(401).json({
      error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" }
    });
    return;
  }

  const token = signAccessToken({ sub: admin._id.toString(), email: admin.email });
  logger.info({ email: admin.email }, "login succeeded");
  res.json({
    token,
    user: { id: admin._id.toString(), email: admin.email, name: admin.name }
  });
}

export async function me(req: AuthedRequest, res: Response): Promise<void> {
  res.json({ user: req.user });
}

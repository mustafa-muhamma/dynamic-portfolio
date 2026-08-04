import { Router, type Request, type Response } from "express";
import multer from "multer";

import { logger } from "../lib/logger.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { cloudinaryConfigured } from "../services/cloudinary.js";
import { uploadImage } from "../services/upload.js";

const uploadMiddleware = upload.single("file");

export const mediaRouter = Router();

mediaRouter.post(
  "/media",
  requireAuth,
  (req, res, next) => {
    uploadMiddleware(req, res, (err: unknown) => {
      if (err) {
        const isMulter = err instanceof multer.MulterError;
        const message = isMulter
          ? err.code === "LIMIT_FILE_SIZE"
            ? "File too large (max 5MB)"
            : err.message
          : err instanceof Error
            ? err.message
            : "Upload failed";
        const code = isMulter ? err.code : "UPLOAD_ERROR";
        return res.status(400).json({ error: { code, message } });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: { code: "NO_FILE", message: 'No image file provided in field "file"' }
      });
    }

    if (!cloudinaryConfigured()) {
      return res.status(500).json({
        error: { code: "MEDIA_NOT_CONFIGURED", message: "Cloudinary is not configured" }
      });
    }

    try {
      const asset = await uploadImage(file.path, { originalName: file.originalname });
      return res.status(201).json(asset);
    } catch (error) {
      logger.error({ err: error }, "image upload failed");
      return res.status(500).json({
        error: { code: "UPLOAD_FAILED", message: "Failed to upload image" }
      });
    }
  }
);

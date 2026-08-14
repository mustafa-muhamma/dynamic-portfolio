import { Router, type Request, type Response } from "express";
import multer from "multer";

import { logger } from "../lib/logger.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadDocument, uploadImage } from "../middleware/upload.js";
import { cloudinaryConfigured } from "../services/cloudinary.js";
import {
  deleteFile,
  extractCloudinaryAsset,
  uploadFile,
  type UploadKind
} from "../services/upload.js";

function parseKind(value: unknown): UploadKind {
  return value === "document" ? "document" : "image";
}

export const mediaRouter = Router();

mediaRouter.post(
  "/media",
  requireAuth,
  (req: Request, res: Response, next) => {
    const middleware =
      parseKind(req.query.kind) === "document"
        ? uploadDocument.single("file")
        : uploadImage.single("file");
    middleware(req, res, (err: unknown) => {
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
        error: { code: "NO_FILE", message: 'No file provided in field "file"' }
      });
    }

    if (!cloudinaryConfigured()) {
      return res.status(500).json({
        error: { code: "MEDIA_NOT_CONFIGURED", message: "Cloudinary is not configured" }
      });
    }

    const kind = parseKind(req.query.kind);

    try {
      const asset = await uploadFile(file.path, { originalName: file.originalname, kind });
      return res.status(201).json(asset);
    } catch (error) {
      logger.error({ err: error }, "file upload failed");
      return res.status(500).json({
        error: { code: "UPLOAD_FAILED", message: "Failed to upload file" }
      });
    }
  }
);

mediaRouter.delete("/media", requireAuth, async (req: Request, res: Response) => {
  const urls: unknown = (req.body as { urls?: unknown } | undefined)?.urls;
  const list = Array.isArray(urls) ? urls.filter((u): u is string => typeof u === "string") : [];

  if (list.length === 0) {
    return res.status(400).json({
      error: { code: "NO_URLS", message: 'Provide a non-empty "urls" array' }
    });
  }

  if (!cloudinaryConfigured()) {
    return res.status(503).json({
      error: { code: "MEDIA_NOT_CONFIGURED", message: "Cloudinary is not configured" }
    });
  }

  const deleted: string[] = [];
  const skipped: string[] = [];
  for (const url of list) {
    const asset = extractCloudinaryAsset(url);
    if (!asset) {
      skipped.push(url);
      continue;
    }
    try {
      await deleteFile(asset.publicId, asset.kind);
      deleted.push(url);
    } catch (error) {
      logger.error({ err: error, url }, "media delete failed");
      skipped.push(url);
    }
  }
  return res.json({ deleted, skipped });
});

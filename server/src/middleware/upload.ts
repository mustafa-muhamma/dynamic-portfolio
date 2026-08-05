import { randomUUID } from "node:crypto";
import { mkdtempSync } from "node:fs";
import path from "node:path";
import os from "node:os";

import multer from "multer";

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

const tempDir = mkdtempSync(path.join(os.tmpdir(), "portfolio-upload-"));

const storage = multer.diskStorage({
  destination: tempDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  }
});

const limits = { fileSize: MAX_UPLOAD_SIZE, files: 1 };

const DOCUMENT_MIMETYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

export const uploadImage = multer({
  storage,
  limits,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});

export const uploadDocument = multer({
  storage,
  limits,
  fileFilter: (_req, file, cb) => {
    if (DOCUMENT_MIMETYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    }
  }
});

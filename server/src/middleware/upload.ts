import { randomUUID } from "node:crypto";
import { mkdtempSync } from "node:fs";
import path from "node:path";
import os from "node:os";

import multer from "multer";

const tempDir = mkdtempSync(path.join(os.tmpdir(), "portfolio-upload-"));

const storage = multer.diskStorage({
  destination: tempDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});

import { readFile, unlink } from "node:fs/promises";

import type { Request, Response } from "express";

import { logger } from "../lib/logger.js";
import { toApiDoc } from "../lib/serialize.js";
import { ResumeModel } from "../models/resume.model.js";

function safeFilename(name: string): string {
  const cleaned = name
    .replace(/[^\w.-]+/g, "_")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 128);
  return cleaned || "resume";
}

export async function uploadResume(req: Request, res: Response): Promise<void> {
  const file = req.file;
  if (!file) {
    res
      .status(400)
      .json({ error: { code: "NO_FILE", message: 'No file provided in field "file"' } });
    return;
  }

  try {
    const data = await readFile(file.path);
    const payload = {
      fileName: file.originalname,
      mimeType: file.mimetype || "application/octet-stream",
      size: file.size,
      data,
      fileUrl: ""
    };

    const existing = await ResumeModel.findOne().select("_id").lean();
    if (existing) {
      await ResumeModel.findByIdAndUpdate(existing._id, payload, { runValidators: true });
    } else {
      await ResumeModel.create(payload);
    }

    const doc = (await ResumeModel.findOne().select("-data").lean()) as { _id: unknown } | null;
    if (!doc) {
      res.status(500).json({
        error: { code: "UPLOAD_FAILED", message: "Resume not found after upload" }
      });
      return;
    }
    res.json(toApiDoc(doc));
  } catch (error) {
    logger.error({ err: error }, "resume upload failed");
    res.status(500).json({ error: { code: "UPLOAD_FAILED", message: "Failed to store resume" } });
  } finally {
    await unlink(file.path).catch(() => undefined);
  }
}

export async function getResumeDownload(_req: Request, res: Response): Promise<void> {
  const resume = (await ResumeModel.findOne().select("+data")) as {
    data?: Buffer;
    fileUrl?: string;
    fileName?: string;
    mimeType?: string;
  } | null;

  if (!resume) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Resume not found" } });
    return;
  }

  if (resume.data && resume.data.length > 0) {
    const filename = safeFilename(resume.fileName || "resume");
    res.set({
      "Content-Type": resume.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(resume.data.length),
      "Cache-Control": "no-store"
    });
    res.send(resume.data);
    return;
  }

  if (resume.fileUrl) {
    res.redirect(302, resume.fileUrl);
    return;
  }

  res.status(404).json({ error: { code: "NOT_FOUND", message: "Resume not found" } });
}

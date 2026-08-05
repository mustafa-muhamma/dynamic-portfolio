import { randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";
import path from "node:path";

import { cloudinary } from "./cloudinary.js";

export type UploadKind = "image" | "document";

export interface UploadedAsset {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  width?: number;
  height?: number;
}

export async function uploadFile(
  filePath: string,
  options: { originalName: string; folder?: string; kind?: UploadKind }
): Promise<UploadedAsset> {
  try {
    const kind = options.kind ?? "image";
    const resourceType = kind === "document" ? "raw" : "image";
    const folder = options.folder ?? "portfolio";
    const ext = path.extname(options.originalName).toLowerCase();
    const base = path
      .basename(options.originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 64);
    const publicId = `${folder}/${base}-${Date.now()}-${randomUUID().slice(0, 6)}`;

    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      resource_type: resourceType,
      overwrite: false
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      bytes: result.bytes,
      format: result.format,
      ...(resourceType === "image" ? { width: result.width, height: result.height } : {})
    };
  } finally {
    await unlink(filePath).catch(() => undefined);
  }
}

export async function deleteFile(publicId: string, kind: UploadKind = "image"): Promise<boolean> {
  const resourceType = kind === "document" ? "raw" : "image";
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  return result.result === "ok";
}

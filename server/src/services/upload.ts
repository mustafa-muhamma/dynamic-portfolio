import { randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";
import path from "node:path";

import { cloudinary } from "./cloudinary.js";

export interface UploadedAsset {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  width: number;
  height: number;
}

export async function uploadImage(
  filePath: string,
  options: { originalName: string; folder?: string }
): Promise<UploadedAsset> {
  try {
    const folder = options.folder ?? "portfolio";
    const ext = path.extname(options.originalName).toLowerCase();
    const base = path
      .basename(options.originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 64);
    const publicId = `${folder}/${base}-${Date.now()}-${randomUUID().slice(0, 6)}`;

    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      resource_type: "image",
      overwrite: false
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      bytes: result.bytes,
      format: result.format,
      width: result.width,
      height: result.height
    };
  } finally {
    await unlink(filePath).catch(() => undefined);
  }
}

export async function deleteImage(publicId: string): Promise<boolean> {
  const result = await cloudinary.uploader.destroy(publicId);
  return result.result === "ok";
}

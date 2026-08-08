import { ApiError, handleUnauthorized } from "@/lib/admin-api";

export type UploadKind = "image" | "document";

export interface UploadedAsset {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  width?: number;
  height?: number;
}

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml";

export const DOCUMENT_ACCEPT =
  "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const DOCUMENT_MIMETYPES = new Set(DOCUMENT_ACCEPT.split(",").map((type) => type.trim()));

export function validateFile(file: File, kind: UploadKind): string | undefined {
  if (file.size > MAX_UPLOAD_SIZE) {
    return "File is too large (max 5MB)";
  }
  if (kind === "document") {
    if (!DOCUMENT_MIMETYPES.has(file.type)) {
      return "Only PDF, DOC, or DOCX files are allowed";
    }
  } else if (!file.type.startsWith("image/")) {
    return "Only image files are allowed";
  }
  return undefined;
}

export async function uploadFile(file: File, kind: UploadKind): Promise<UploadedAsset> {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch(`/api/media?kind=${kind}`, {
    method: "POST",
    body,
    cache: "no-store"
  });

  if (res.status === 401) {
    await handleUnauthorized();
    throw new ApiError(401, "Session expired. Please log in again.");
  }

  const text = await res.text();
  const data = text
    ? (JSON.parse(text) as UploadedAsset | { error?: { message?: string } })
    : undefined;

  if (!res.ok) {
    const message =
      (data as { error?: { message?: string } })?.error?.message ?? `Upload failed (${res.status})`;
    throw new ApiError(res.status, message);
  }

  return data as UploadedAsset;
}

export interface ResumeUploadResult {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  size?: number;
}

export async function uploadResumeFile(file: File): Promise<ResumeUploadResult> {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch("/api/admin/resume/upload", {
    method: "POST",
    body,
    cache: "no-store"
  });

  if (res.status === 401) {
    await handleUnauthorized();
    throw new ApiError(401, "Session expired. Please log in again.");
  }

  const text = await res.text();
  const data = text
    ? (JSON.parse(text) as ResumeUploadResult | { error?: { message?: string } })
    : undefined;

  if (!res.ok) {
    const message =
      (data as { error?: { message?: string } })?.error?.message ?? `Upload failed (${res.status})`;
    throw new ApiError(res.status, message);
  }

  return data as ResumeUploadResult;
}

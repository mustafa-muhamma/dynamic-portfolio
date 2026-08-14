/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Crop,
  Expand,
  FileText,
  GripVertical,
  Link2,
  Loader2,
  Upload,
  X
} from "lucide-react";
import { toast } from "sonner";

import { ImageCropModal } from "@/components/admin/image-crop-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GalleryImage } from "@/lib/content";
import { normalizeImage } from "@/lib/crop";
import { normalizeGalleryImages } from "@/lib/images";
import {
  DOCUMENT_ACCEPT,
  IMAGE_ACCEPT,
  deleteMedia,
  uploadFile,
  validateFile,
  type UploadedAsset,
  type UploadKind
} from "@/lib/media";

function PickerError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

function PickerHint({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-xs text-muted-foreground">{children}</p>;
}

type FilePickerProps = {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  onUploaded?: (asset: UploadedAsset, file: File) => void;
  kind: UploadKind;
  error?: string;
  hint?: string;
};

export function FilePicker({
  label,
  value,
  onChange,
  onUploaded,
  kind,
  error,
  hint
}: FilePickerProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadedRef = useRef<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropSrc, setCropSrc] = useState<string>();

  useEffect(() => {
    return () => {
      if (cropSrc) URL.revokeObjectURL(cropSrc);
    };
  }, [cropSrc]);

  const accept = kind === "document" ? DOCUMENT_ACCEPT : IMAGE_ACCEPT;

  async function uploadAndSet(file: File) {
    setUploading(true);
    try {
      if (value && uploadedRef.current.has(value)) {
        uploadedRef.current.delete(value);
        void deleteMedia([value]);
      }
      const asset = await uploadFile(file, kind);
      uploadedRef.current.add(asset.url);
      onChange(asset.url);
      onUploaded?.(asset, file);
      toast.success(kind === "document" ? "File uploaded" : "Image uploaded");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setUploadError(message);
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const validation = validateFile(file, kind);
    if (validation) {
      setUploadError(validation);
      toast.error(validation);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setUploadError(undefined);
    if (kind === "image") {
      void openCropModal(file);
      return;
    }
    void uploadAndSet(file);
  }

  async function openCropModal(file: File) {
    const normalized = await normalizeImage(file);
    setCropSrc(URL.createObjectURL(normalized));
    setCropFile(file);
  }

  function closeCrop() {
    setCropFile(null);
    setCropSrc(undefined);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function saveCropped(blob: Blob) {
    if (!cropFile) return;
    const cropped = new File([blob], cropFile.name, { type: blob.type });
    await uploadAndSet(cropped);
    closeCrop();
  }

  async function skipCrop() {
    if (!cropFile) return;
    await uploadAndSet(cropFile);
    closeCrop();
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-3 rounded-lg border p-3">
        {uploading ? (
          <Loader2 className="size-10 animate-spin text-muted-foreground" />
        ) : value ? (
          kind === "document" ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground"
              title="Open uploaded file"
            >
              <FileText className="size-5" />
            </a>
          ) : (
            <img src={value} alt="" className="size-10 rounded-md border object-cover" />
          )
        ) : (
          <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <FileText className="size-5" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
              {uploading ? "Uploading..." : value ? "Replace" : "Upload"}
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (value && uploadedRef.current.has(value)) {
                    uploadedRef.current.delete(value);
                    void deleteMedia([value]);
                  }
                  onChange("");
                }}
              >
                <X />
                Remove
              </Button>
            )}
          </div>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <PickerHint>{kind === "document" ? "PDF, DOC, or DOCX. Max 5MB." : hint}</PickerHint>
        </div>
      </div>
      <PickerError message={error ?? uploadError} />
      <div className="flex items-center gap-2">
        <Link2 className="size-4 shrink-0 text-muted-foreground" />
        <Input
          aria-label={`${label} URL`}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={kind === "document" ? "Or paste a file URL" : "Or paste an image URL"}
        />
      </div>

      {cropSrc && cropFile ? (
        <ImageCropModal
          src={cropSrc}
          fileName={cropFile.name}
          aspect={1}
          uploading={uploading}
          onCancel={closeCrop}
          onSave={saveCropped}
          onSkip={skipCrop}
        />
      ) : null}
    </div>
  );
}

type PendingImage = {
  id: string;
  file: File;
  src: string;
  cropped?: Blob;
};

type ImageListPickerProps = {
  label: string;
  value?: (string | GalleryImage)[];
  onChange: (images: GalleryImage[]) => void;
  error?: string;
  hint?: string;
  aspect?: number;
};

export function ImageListPicker({
  label,
  value,
  onChange,
  error,
  hint,
  aspect = 16 / 10
}: ImageListPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);
  const uploadedRef = useRef<Set<string>>(new Set());
  const objectUrlsRef = useRef<Set<string>>(new Set());
  const [pending, setPending] = useState<PendingImage[]>([]);
  const [cropId, setCropId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();
  const [urlDraft, setUrlDraft] = useState("");
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const images = normalizeGalleryImages(value);
  const cropTarget = pending.find((item) => item.id === cropId);

  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
      urls.clear();
    };
  }, []);

  useEffect(() => {
    if (previewIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewIndex(null);
        return;
      }
      if (images.length <= 1) return;
      if (e.key === "ArrowLeft") {
        setPreviewIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
      }
      if (e.key === "ArrowRight") {
        setPreviewIndex((i) => (i === null ? i : (i + 1) % images.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewIndex, images.length]);

  async function addPending(file: File) {
    let normalized: Blob;
    try {
      normalized = await normalizeImage(file);
    } catch {
      return;
    }
    const src = URL.createObjectURL(normalized);
    objectUrlsRef.current.add(src);
    setPending((items) => [
      ...items,
      {
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        src
      }
    ]);
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      const validation = validateFile(file, "image");
      if (validation) {
        setUploadError(validation);
        toast.error(validation);
        continue;
      }
      await addPending(file);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function revokePending(id: string) {
    const target = pending.find((item) => item.id === id);
    if (target) {
      URL.revokeObjectURL(target.src);
      objectUrlsRef.current.delete(target.src);
    }
    setPending((items) => items.filter((item) => item.id !== id));
  }

  function clearPending() {
    for (const item of pending) {
      URL.revokeObjectURL(item.src);
      objectUrlsRef.current.delete(item.src);
    }
    setPending([]);
  }

  async function uploadImagePair(original: File, cropped?: Blob): Promise<GalleryImage> {
    const originalAsset = await uploadFile(original, "image");
    if (!cropped) {
      uploadedRef.current.add(originalAsset.url);
      return { url: originalAsset.url, originalUrl: originalAsset.url };
    }
    const croppedFile = new File([cropped], original.name, { type: cropped.type || "image/jpeg" });
    const cropAsset = await uploadFile(croppedFile, "image");
    uploadedRef.current.add(cropAsset.url);
    uploadedRef.current.add(originalAsset.url);
    return { url: cropAsset.url, originalUrl: originalAsset.url };
  }

  function saveCrop(blob: Blob) {
    if (!cropId) return;
    setPending((items) =>
      items.map((item) => (item.id === cropId ? { ...item, cropped: blob } : item))
    );
    setCropId(null);
  }

  async function addAllPending() {
    if (pending.length === 0 || uploading) return;
    setUploading(true);
    setUploadError(undefined);
    try {
      const added: GalleryImage[] = [];
      for (const item of pending) {
        added.push(await uploadImagePair(item.file, item.cropped));
      }
      onChange([...images, ...added]);
      toast.success(added.length === 1 ? "Image added" : `${added.length} images added`);
      clearPending();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setUploadError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    const removed = images[index];
    const toDelete = [removed.url, removed.originalUrl].filter((url) =>
      uploadedRef.current.has(url)
    );
    for (const url of toDelete) uploadedRef.current.delete(url);
    if (toDelete.length > 0) void deleteMedia(toDelete);
    onChange(images.filter((_, i) => i !== index));
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length || from === to) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }

  function addUrl() {
    const trimmed = urlDraft.trim();
    if (!trimmed) return;
    onChange([...images, { url: trimmed, originalUrl: trimmed }]);
    setUrlDraft("");
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              draggable
              onDragStart={(e) => {
                dragIndex.current = index;
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => {
                e.preventDefault();
                const from = dragIndex.current;
                dragIndex.current = null;
                if (from != null) moveImage(from, index);
              }}
              onDragEnd={() => {
                dragIndex.current = null;
              }}
              className="group relative cursor-grab active:cursor-grabbing"
              title="Drag to reorder · click to preview"
            >
              <div className="relative">
                <img src={image.url} alt="" className="size-16 rounded-md border object-cover" />
                <button
                  type="button"
                  aria-label={`Preview image ${index + 1}`}
                  onClick={() => setPreviewIndex(index)}
                  className="absolute inset-0 flex items-center justify-center rounded-md bg-black/0 text-white opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100"
                >
                  <Expand className="size-4" />
                </button>
              </div>
              <button
                type="button"
                aria-label={`Remove image ${index + 1}`}
                onClick={() => removeImage(index)}
                className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-80 shadow-sm transition-opacity hover:opacity-100"
              >
                <X className="size-3" />
              </button>
              <GripVertical className="absolute -bottom-1.5 -left-1.5 size-5 rounded-full bg-background text-muted-foreground shadow-sm ring-1 ring-border" />
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
          {uploading ? "Uploading..." : "Upload images"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {pending.length > 0 ? (
        <div className="rounded-lg border border-dashed p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">
              {pending.length} {pending.length === 1 ? "image" : "images"} ready
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearPending}
              disabled={uploading}
            >
              <X />
              Clear
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {pending.map((item) => (
              <div key={item.id} className="group relative">
                <img src={item.src} alt="" className="size-16 rounded-md border object-cover" />
                {item.cropped ? (
                  <span className="absolute -top-1.5 -left-1.5 rounded-full bg-brand-2 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm">
                    Cropped
                  </span>
                ) : null}
                <button
                  type="button"
                  aria-label="Crop this image"
                  onClick={() => setCropId(item.id)}
                  disabled={uploading}
                  className="absolute inset-0 flex items-center justify-center rounded-md bg-black/0 text-white opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100"
                >
                  <Crop className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Remove this pending image"
                  onClick={() => revokePending(item.id)}
                  disabled={uploading}
                  className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm transition-opacity hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button type="button" size="sm" onClick={addAllPending} disabled={uploading}>
              {uploading ? <Loader2 className="animate-spin" /> : <Check />}
              {uploading ? "Adding..." : `Add all (${pending.length})`}
            </Button>
            <PickerHint>
              Crop any image first; the rest upload as-is and use the full image in the gallery.
            </PickerHint>
          </div>
        </div>
      ) : null}
      <div className="flex items-center gap-2">
        <Input
          aria-label={`Add ${label.toLowerCase()} URL`}
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="Or add an image URL"
        />
        <Button type="button" variant="outline" size="sm" onClick={addUrl}>
          Add
        </Button>
      </div>
      <PickerHint>{hint}</PickerHint>
      <PickerError message={error ?? uploadError} />

      {cropTarget ? (
        <ImageCropModal
          key={cropTarget.id}
          src={cropTarget.src}
          fileName={cropTarget.file.name}
          aspect={aspect}
          shape="rect"
          uploading={false}
          onCancel={() => setCropId(null)}
          onSave={saveCrop}
          onSkip={() => setCropId(null)}
        />
      ) : null}

      {previewIndex !== null && images.length > 0 ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setPreviewIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${previewIndex + 1} of ${images.length}`}
        >
          <button
            type="button"
            aria-label="Close preview"
            onClick={() => setPreviewIndex(null)}
            className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewIndex((previewIndex - 1 + images.length) % images.length);
                }}
                className="absolute top-1/2 left-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewIndex((previewIndex + 1) % images.length);
                }}
                className="absolute top-1/2 right-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}
          <img
            src={images[previewIndex].originalUrl}
            alt={`Full image ${previewIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
          />
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-white">
            {previewIndex + 1} / {images.length}
          </span>
        </div>
      ) : null}
    </div>
  );
}

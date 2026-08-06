/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FileText, Link2, Loader2, Upload, X } from "lucide-react";

import { ImageCropModal } from "@/components/admin/image-crop-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeImage } from "@/lib/crop";
import {
  DOCUMENT_ACCEPT,
  IMAGE_ACCEPT,
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
      const asset = await uploadFile(file, kind);
      onChange(asset.url);
      onUploaded?.(asset, file);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
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
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
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

type ImageListPickerProps = {
  label: string;
  value?: string[];
  onChange: (urls: string[]) => void;
  error?: string;
  hint?: string;
};

export function ImageListPicker({ label, value, onChange, error, hint }: ImageListPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();
  const [urlDraft, setUrlDraft] = useState("");
  const urls = value ?? [];

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadError(undefined);
    const added: string[] = [];
    for (const file of Array.from(files)) {
      const validation = validateFile(file, "image");
      if (validation) {
        setUploadError(validation);
        continue;
      }
      try {
        const asset = await uploadFile(file, "image");
        added.push(asset.url);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
        break;
      }
    }
    if (added.length) onChange([...urls, ...added]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function addUrl() {
    const trimmed = urlDraft.trim();
    if (!trimmed) return;
    onChange([...urls, trimmed]);
    setUrlDraft("");
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative">
              <img src={url} alt="" className="size-16 rounded-md border object-cover" />
              <button
                type="button"
                aria-label={`Remove image ${index + 1}`}
                onClick={() => onChange(urls.filter((_, i) => i !== index))}
                className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-80 shadow-sm transition-opacity hover:opacity-100"
              >
                <X className="size-3" />
              </button>
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
    </div>
  );
}

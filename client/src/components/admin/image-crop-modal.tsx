"use client";

import { useEffect, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cropImageToBlob } from "@/lib/crop";

type ImageCropModalProps = {
  src: string;
  fileName: string;
  aspect?: number;
  uploading: boolean;
  onCancel: () => void;
  onSave: (blob: Blob) => Promise<void> | void;
  onSkip: () => void;
};

export function ImageCropModal({
  src,
  fileName,
  aspect = 1,
  uploading,
  onCancel,
  onSave,
  onSkip
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<Area>();
  const [previewSrc, setPreviewSrc] = useState<string>();
  const [confirming, setConfirming] = useState(false);
  const busy = uploading || confirming;

  const previewUrlRef = useRef<string | undefined>(undefined);
  const previewVersion = useRef(0);

  useEffect(() => {
    if (!pixels) return;
    const version = ++previewVersion.current;
    const timer = window.setTimeout(async () => {
      try {
        const blob = await cropImageToBlob(src, pixels);
        if (previewVersion.current !== version) return;
        const url = URL.createObjectURL(blob);
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = url;
        setPreviewSrc(url);
      } catch {
        /* keep the previous preview */
      }
    }, 150);
    return () => window.clearTimeout(timer);
  }, [src, pixels]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  async function handleSave() {
    if (!pixels) return;
    setConfirming(true);
    try {
      const blob = await cropImageToBlob(src, pixels);
      await onSave(blob);
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl rounded-xl border bg-background p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Crop image</h2>
          <span className="text-xs text-muted-foreground">{fileName}</span>
        </div>

        <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative h-72 w-full flex-1 overflow-hidden rounded-lg bg-black">
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, areaPixels) => setPixels(areaPixels)}
              onCropAreaChange={(_, areaPixels) => setPixels(areaPixels)}
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-gradient-brand p-[2px]">
              <div className="relative size-32 overflow-hidden rounded-full bg-muted">
                {previewSrc ? (
                  <img
                    src={previewSrc}
                    alt="Preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <Loader2 className="size-5 animate-spin" />
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Live preview</span>
          </div>
        </div>

        <label className="mt-3 block text-xs text-muted-foreground">
          Zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="mt-1 w-full"
          />
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button type="button" variant="outline" onClick={onSkip} disabled={busy}>
            Upload original
          </Button>
          <Button type="button" onClick={handleSave} disabled={!pixels || busy}>
            {busy ? "Saving..." : "Save crop"}
          </Button>
        </div>
      </div>
    </div>
  );
}

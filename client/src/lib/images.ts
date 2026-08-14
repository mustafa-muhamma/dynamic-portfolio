import type { GalleryImage } from "@/lib/content";

export function toGalleryImage(value: string | GalleryImage): GalleryImage {
  return typeof value === "string" ? { url: value, originalUrl: value } : value;
}

export function normalizeGalleryImages(images?: (string | GalleryImage)[]): GalleryImage[] {
  return Array.isArray(images) ? images.map(toGalleryImage) : [];
}

export function galleryImageUrls(images?: (string | GalleryImage)[]): string[] {
  const urls: string[] = [];
  for (const image of normalizeGalleryImages(images)) {
    for (const url of [image.url, image.originalUrl]) {
      if (url && !urls.includes(url)) urls.push(url);
    }
  }
  return urls;
}

export function galleryDisplayUrls(images?: (string | GalleryImage)[]): string[] {
  return normalizeGalleryImages(images).map((image) => image.url);
}

export function mediaDiffRemoved(original: string[], draft: string[]): string[] {
  const after = new Set(draft);
  return Array.from(new Set(original)).filter((url) => url && !after.has(url));
}

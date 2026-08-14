import { describe, expect, it } from "vitest";

import { extractCloudinaryAsset } from "../src/services/upload.js";

describe("extractCloudinaryAsset", () => {
  it("extracts a simple image public id", () => {
    expect(
      extractCloudinaryAsset("https://res.cloudinary.com/demo/image/upload/v1613040635/sample.jpg")
    ).toEqual({ publicId: "sample", kind: "image" });
  });

  it("extracts a folder-based image public id", () => {
    expect(
      extractCloudinaryAsset(
        "https://res.cloudinary.com/demo/image/upload/v1613040635/portfolio/photo-123-abc.png"
      )
    ).toEqual({ publicId: "portfolio/photo-123-abc", kind: "image" });
  });

  it("extracts a raw (document) public id", () => {
    expect(
      extractCloudinaryAsset("https://res.cloudinary.com/demo/raw/upload/v1613040635/resume.pdf")
    ).toEqual({ publicId: "resume", kind: "document" });
  });

  it("handles URLs without a version segment", () => {
    expect(
      extractCloudinaryAsset("https://res.cloudinary.com/demo/image/upload/portfolio/photo.png")
    ).toEqual({ publicId: "portfolio/photo", kind: "image" });
  });

  it("ignores URLs outside Cloudinary", () => {
    expect(extractCloudinaryAsset("https://example.com/image/sample.jpg")).toBeNull();
    expect(extractCloudinaryAsset("not-a-url")).toBeNull();
  });

  it("ignores non-image/non-raw resource types", () => {
    expect(
      extractCloudinaryAsset("https://res.cloudinary.com/demo/video/upload/v1/clip.mp4")
    ).toBeNull();
  });
});

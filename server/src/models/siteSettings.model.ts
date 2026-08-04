import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const { Schema, model, models } = mongoose;

const sectionVisibilitySchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, default: "" },
    enabled: { type: Boolean, default: true }
  },
  { _id: false }
);

const siteSettingsSchema = new Schema(
  {
    siteName: { type: String, required: true, trim: true },
    tagline: { type: String, default: "" },
    navigationLabels: { type: Schema.Types.Mixed, default: {} },
    sectionVisibility: { type: [sectionVisibilitySchema], default: [] }
  },
  { timestamps: true, versionKey: false }
);

export type SiteSettings = InferSchemaType<typeof siteSettingsSchema>;

export const SiteSettingsModel = models.SiteSettings ?? model("SiteSettings", siteSettingsSchema);

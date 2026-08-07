import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const { Schema, model, models } = mongoose;

const socialLinkSchema = new Schema(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    icon: { type: String, default: "" },
    iconUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

export type SocialLink = InferSchemaType<typeof socialLinkSchema>;

const socialLinkModel = model("SocialLink", socialLinkSchema);
export const SocialLinkModel: typeof socialLinkModel = models.SocialLink ?? socialLinkModel;

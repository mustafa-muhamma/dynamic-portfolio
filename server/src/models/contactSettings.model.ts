import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const { Schema, model, models } = mongoose;

const contactSettingsSchema = new Schema(
  {
    email: { type: String, default: "", trim: true },
    phone: { type: String, default: "" },
    availability: { type: String, default: "" },
    location: { type: String, default: "" },
    formEnabled: { type: Boolean, default: true }
  },
  { timestamps: true, versionKey: false }
);

export type ContactSettings = InferSchemaType<typeof contactSettingsSchema>;

const contactSettingsModel = model("ContactSettings", contactSettingsSchema);
export const ContactSettingsModel: typeof contactSettingsModel =
  models.ContactSettings ?? contactSettingsModel;

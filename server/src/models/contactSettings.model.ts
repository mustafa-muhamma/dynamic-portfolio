import { model, models, Schema, type InferSchemaType } from "mongoose";

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

export const ContactSettingsModel =
  models.ContactSettings ?? model("ContactSettings", contactSettingsSchema);

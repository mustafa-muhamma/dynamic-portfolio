import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const { Schema, model, models } = mongoose;

const profileSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, default: "" },
    bio: { type: String, default: "" },
    photo: { type: String, default: "" },
    resume: { type: String, default: "" },
    yearsExperience: { type: Number, default: 0, min: 0 },
    contactEmail: { type: String, required: true, trim: true }
  },
  { timestamps: true, versionKey: false }
);

export type Profile = InferSchemaType<typeof profileSchema>;

const profileModel = model("Profile", profileSchema);
export const ProfileModel: typeof profileModel = models.Profile ?? profileModel;

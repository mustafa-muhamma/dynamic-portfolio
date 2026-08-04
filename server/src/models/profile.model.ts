import { model, models, Schema, type InferSchemaType } from "mongoose";

const profileSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, default: "" },
    bio: { type: String, default: "" },
    photo: { type: String, default: "" },
    resume: { type: String, default: "" },
    contactEmail: { type: String, required: true, trim: true }
  },
  { timestamps: true, versionKey: false }
);

export type Profile = InferSchemaType<typeof profileSchema>;

export const ProfileModel = models.Profile ?? model("Profile", profileSchema);

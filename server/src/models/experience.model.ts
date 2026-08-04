import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const { Schema, model, models } = mongoose;

const experienceSchema = new Schema(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, default: "" },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    current: { type: Boolean, default: false },
    summary: { type: String, default: "" },
    bullets: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

export type Experience = InferSchemaType<typeof experienceSchema>;

const experienceModel = model("Experience", experienceSchema);
export const ExperienceModel: typeof experienceModel = models.Experience ?? experienceModel;

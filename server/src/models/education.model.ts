import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const { Schema, model, models } = mongoose;

const educationSchema = new Schema(
  {
    degree: { type: String, required: true, trim: true },
    school: { type: String, required: true, trim: true },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    summary: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

export type Education = InferSchemaType<typeof educationSchema>;

export const EducationModel = models.Education ?? model("Education", educationSchema);

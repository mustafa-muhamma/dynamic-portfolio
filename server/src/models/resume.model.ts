import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const { Schema, model, models } = mongoose;

const resumeSchema = new Schema(
  {
    fileName: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true, trim: true },
    mimeType: { type: String, default: "application/pdf" },
    size: { type: Number, default: 0 }
  },
  { timestamps: true, versionKey: false }
);

export type Resume = InferSchemaType<typeof resumeSchema>;

const resumeModel = model("Resume", resumeSchema);
export const ResumeModel: typeof resumeModel = models.Resume ?? resumeModel;

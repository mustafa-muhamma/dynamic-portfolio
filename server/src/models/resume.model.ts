import { model, models, Schema, type InferSchemaType } from "mongoose";

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

export const ResumeModel = models.Resume ?? model("Resume", resumeSchema);

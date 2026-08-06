import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const { Schema, model, models } = mongoose;

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    description: { type: String, default: "" },
    role: { type: String, default: "" },
    date: { type: String, default: "" },
    link: { type: String, default: "" },
    repo: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    inProgress: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

export type Project = InferSchemaType<typeof projectSchema>;

const projectModel = model("Project", projectSchema);
export const ProjectModel: typeof projectModel = models.Project ?? projectModel;

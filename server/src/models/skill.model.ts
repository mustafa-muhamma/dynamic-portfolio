import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const { Schema, model, models } = mongoose;

const skillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: "General" },
    level: { type: Number, min: 1, max: 5, default: 3 },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

export type Skill = InferSchemaType<typeof skillSchema>;

export const SkillModel = models.Skill ?? model("Skill", skillSchema);

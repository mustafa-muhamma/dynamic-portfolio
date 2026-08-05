import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const { Schema, model, models } = mongoose;

const heroSchema = new Schema(
  {
    eyebrow: { type: String, default: "" },
    heading: { type: String, required: true, trim: true },
    subheading: { type: String, default: "" },
    primaryCtaLabel: { type: String, default: "" },
    primaryCtaUrl: { type: String, default: "" },
    secondaryCtaLabel: { type: String, default: "" },
    secondaryCtaUrl: { type: String, default: "" },
    image: { type: String, default: "" },
    backgroundType: { type: String, enum: ["color", "image"], default: "color" },
    backgroundColor: { type: String, default: "" },
    backgroundImage: { type: String, default: "" },
    animated: { type: Boolean, default: false },
    published: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

export type Hero = InferSchemaType<typeof heroSchema>;

const heroModel = model("Hero", heroSchema);
export const HeroModel: typeof heroModel = models.Hero ?? heroModel;

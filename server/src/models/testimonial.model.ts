import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const { Schema, model, models } = mongoose;

const testimonialSchema = new Schema(
  {
    author: { type: String, required: true, trim: true },
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    quote: { type: String, required: true },
    avatar: { type: String, default: "" },
    projectId: { type: String, default: "" },
    images: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

export type Testimonial = InferSchemaType<typeof testimonialSchema>;

const testimonialModel = model("Testimonial", testimonialSchema);
export const TestimonialModel: typeof testimonialModel = models.Testimonial ?? testimonialModel;

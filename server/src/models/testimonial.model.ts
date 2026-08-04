import { model, models, Schema, type InferSchemaType } from "mongoose";

const testimonialSchema = new Schema(
  {
    author: { type: String, required: true, trim: true },
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    quote: { type: String, required: true },
    avatar: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

export type Testimonial = InferSchemaType<typeof testimonialSchema>;

export const TestimonialModel = models.Testimonial ?? model("Testimonial", testimonialSchema);

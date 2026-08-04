import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const { Schema, model, models } = mongoose;

const inquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

export type Inquiry = InferSchemaType<typeof inquirySchema>;

const inquiryModel = model("Inquiry", inquirySchema);
export const InquiryModel: typeof inquiryModel = models.Inquiry ?? inquiryModel;

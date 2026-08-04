import { model, models, Schema, type InferSchemaType } from "mongoose";

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

export const InquiryModel = models.Inquiry ?? model("Inquiry", inquirySchema);

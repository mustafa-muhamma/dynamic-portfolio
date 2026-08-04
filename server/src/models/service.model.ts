import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const { Schema, model, models } = mongoose;

const serviceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    deliverables: { type: [String], default: [] },
    price: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

export type Service = InferSchemaType<typeof serviceSchema>;

const serviceModel = model("Service", serviceSchema);
export const ServiceModel: typeof serviceModel = models.Service ?? serviceModel;

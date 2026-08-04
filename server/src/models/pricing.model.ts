import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const { Schema, model, models } = mongoose;

const pricingSchema = new Schema(
  {
    tier: { type: String, required: true, trim: true },
    price: { type: Number, default: 0 },
    period: { type: String, default: "" },
    features: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

export type Pricing = InferSchemaType<typeof pricingSchema>;

const pricingModel = model("Pricing", pricingSchema);
export const PricingModel: typeof pricingModel = models.Pricing ?? pricingModel;

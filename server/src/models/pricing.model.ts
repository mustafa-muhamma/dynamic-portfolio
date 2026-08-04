import { model, models, Schema, type InferSchemaType } from "mongoose";

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

export const PricingModel = models.Pricing ?? model("Pricing", pricingSchema);

import { model, models, Schema, type InferSchemaType } from "mongoose";

const adminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "" }
  },
  { timestamps: true, versionKey: false }
);

export type Admin = InferSchemaType<typeof adminSchema>;

export const AdminModel = models.Admin ?? model("Admin", adminSchema);

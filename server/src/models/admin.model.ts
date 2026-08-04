import mongoose, { type InferSchemaType } from "mongoose";

const { Schema, model, models } = mongoose;

const adminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "" }
  },
  { timestamps: true, versionKey: false }
);

export type Admin = InferSchemaType<typeof adminSchema>;

const adminModel = model("Admin", adminSchema);
export const AdminModel: typeof adminModel = models.Admin ?? adminModel;

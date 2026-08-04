import mongoose from "mongoose";

import { env } from "../src/config/env.js";
import { ensureAdmin } from "../src/lib/adminSeed.js";

export const testAdmin = {
  email: process.env.ADMIN_EMAIL ?? "admin@test.dev",
  password: process.env.ADMIN_PASSWORD ?? "test-admin-password"
};

export async function connectTestDb(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI);
  await mongoose.connection.dropDatabase();
  await ensureAdmin();
}

export async function disconnectTestDb(): Promise<void> {
  await mongoose.disconnect();
}

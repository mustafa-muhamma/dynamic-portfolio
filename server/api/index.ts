import type { Request, Response } from "express";

import { createApp } from "../src/app.js";
import { bootstrap } from "../src/lib/bootstrap.js";

const app = createApp();

export default async function handler(req: Request, res: Response): Promise<void> {
  await bootstrap();
  app(req, res);
}

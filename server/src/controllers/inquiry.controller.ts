import type { Request, Response } from "express";

import { toApiDoc } from "../lib/serialize.js";
import { ContactSettingsModel } from "../models/contactSettings.model.js";
import { InquiryModel } from "../models/inquiry.model.js";
import { createInquirySchema } from "../validation/inquiry.js";

export async function createInquiry(req: Request, res: Response): Promise<void> {
  const parsed = createInquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid inquiry payload",
        details: parsed.error.flatten().fieldErrors
      }
    });
    return;
  }

  const settings = await ContactSettingsModel.findOne().lean();
  if (settings && !settings.formEnabled) {
    res.status(403).json({
      error: { code: "FORM_DISABLED", message: "The inquiry form is currently disabled" }
    });
    return;
  }

  const inquiry = await InquiryModel.create(parsed.data);
  res.status(201).json(toApiDoc(inquiry.toObject()));
}

import type { Request, Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";

import { toApiDoc } from "../lib/serialize.js";
import { ContactSettingsModel } from "../models/contactSettings.model.js";
import { InquiryModel } from "../models/inquiry.model.js";
import { createInquirySchema } from "../validation/inquiry.js";

const markInquiryReadSchema = z.object({ read: z.boolean() });

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

export async function listInquiries(_req: Request, res: Response): Promise<void> {
  const docs = (await InquiryModel.find().sort({ createdAt: -1 }).lean()) as Array<{
    _id: unknown;
  }>;
  res.json(docs.map((doc) => toApiDoc(doc)));
}

export async function updateInquiry(req: Request, res: Response): Promise<void> {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Inquiry not found" } });
    return;
  }

  const parsed = markInquiryReadSchema.safeParse(req.body);
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

  const doc = await InquiryModel.findByIdAndUpdate(id, parsed.data, {
    returnDocument: "after",
    runValidators: true
  }).lean();
  if (!doc) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Inquiry not found" } });
    return;
  }
  res.json(toApiDoc(doc));
}

export async function deleteInquiry(req: Request, res: Response): Promise<void> {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Inquiry not found" } });
    return;
  }

  const doc = await InquiryModel.findByIdAndDelete(id).lean();
  if (!doc) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Inquiry not found" } });
    return;
  }
  res.json({ id: String(id), deleted: true });
}

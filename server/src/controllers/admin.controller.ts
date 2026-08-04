import mongoose from "mongoose";
import type { Request, Response } from "express";
import { z } from "zod";

import { toApiDoc } from "../lib/serialize.js";
import type { LeanModel } from "../types/model.js";

type WriteSchema = z.ZodType<Record<string, unknown>>;

function toObjectIdOrNull(id: string | string[] | undefined): mongoose.Types.ObjectId | null {
  if (typeof id !== "string" || !mongoose.isValidObjectId(id)) return null;
  return new mongoose.Types.ObjectId(id);
}

export function createOne(model: LeanModel, schema: WriteSchema) {
  return async (req: Request, res: Response): Promise<void> => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid payload",
          details: parsed.error.flatten().fieldErrors
        }
      });
      return;
    }

    const doc = await model.create(parsed.data);
    res.status(201).json(toApiDoc(doc.toObject()));
  };
}

export function updateOne(model: LeanModel, schema: WriteSchema) {
  return async (req: Request, res: Response): Promise<void> => {
    const id = toObjectIdOrNull(req.params.id);
    if (!id) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Resource not found" }
      });
      return;
    }

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid payload",
          details: parsed.error.flatten().fieldErrors
        }
      });
      return;
    }

    const doc = await model
      .findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true })
      .lean();
    if (!doc) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Resource not found" }
      });
      return;
    }
    res.json(toApiDoc(doc));
  };
}

export function deleteOne(model: LeanModel, label: string) {
  return async (req: Request, res: Response): Promise<void> => {
    const id = toObjectIdOrNull(req.params.id);
    if (!id) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: `${label} not found` }
      });
      return;
    }

    const doc = await model.findByIdAndDelete(id).lean();
    if (!doc) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: `${label} not found` }
      });
      return;
    }
    res.json({ id: String(id), deleted: true });
  };
}

export function upsertOne(model: LeanModel, createSchema: WriteSchema, updateSchema: WriteSchema) {
  return async (req: Request, res: Response): Promise<void> => {
    const existing = await model.findOne().lean();
    const schema = existing ? updateSchema : createSchema;

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid payload",
          details: parsed.error.flatten().fieldErrors
        }
      });
      return;
    }

    if (existing) {
      const updated = await model
        .findByIdAndUpdate(existing._id, parsed.data, { new: true, runValidators: true })
        .lean();
      res.json(toApiDoc(updated));
      return;
    }

    const created = await model.create(parsed.data);
    res.json(toApiDoc(created.toObject()));
  };
}

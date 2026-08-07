import { z } from "zod";

const optionalString = z.string().trim().optional();
const optionalNumber = z.number().optional();
const optionalBoolean = z.boolean().optional();
const optionalStringArray = z.array(z.string().trim()).optional();

export const serviceWriteSchema = z.object({
  name: z.string().trim().min(1),
  description: optionalString,
  deliverables: optionalStringArray,
  price: optionalNumber,
  order: optionalNumber,
  published: optionalBoolean
});
export const serviceUpdateSchema = serviceWriteSchema.partial();

export const pricingWriteSchema = z.object({
  tier: z.string().trim().min(1),
  price: optionalNumber,
  period: optionalString,
  features: optionalStringArray,
  order: optionalNumber,
  published: optionalBoolean
});
export const pricingUpdateSchema = pricingWriteSchema.partial();

export const processWriteSchema = z.object({
  step: z.number().int().min(1),
  title: z.string().trim().min(1),
  description: optionalString,
  order: optionalNumber,
  published: optionalBoolean
});
export const processUpdateSchema = processWriteSchema.partial();

const testimonialBaseSchema = z.object({
  author: optionalString,
  role: optionalString,
  company: optionalString,
  quote: optionalString,
  avatar: optionalString,
  projectId: optionalString,
  images: optionalStringArray,
  order: optionalNumber,
  published: optionalBoolean
});

export const testimonialWriteSchema = testimonialBaseSchema.superRefine((value, ctx) => {
  const hasProofScreenshots = (value.images?.length ?? 0) > 0;
  if (hasProofScreenshots) return;
  if (!value.author?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["author"],
      message: "Author is required when there are no proof screenshots"
    });
  }
  if (!value.quote?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["quote"],
      message: "Quote is required when there are no proof screenshots"
    });
  }
});
export const testimonialUpdateSchema = testimonialBaseSchema.partial();

export const contactSettingsWriteSchema = z.object({
  email: z.string().trim().email().optional(),
  phone: optionalString,
  availability: optionalString,
  location: optionalString,
  formEnabled: optionalBoolean
});
export const contactSettingsUpdateSchema = contactSettingsWriteSchema.partial();

export const siteSettingsWriteSchema = z.object({
  siteName: z.string().trim().min(1),
  tagline: optionalString,
  navigationLabels: z.record(z.string(), z.string()).optional(),
  sectionVisibility: z
    .array(
      z.object({
        key: z.string().trim().min(1),
        label: z.string().trim(),
        enabled: z.boolean()
      })
    )
    .optional()
});
export const siteSettingsUpdateSchema = siteSettingsWriteSchema.partial();

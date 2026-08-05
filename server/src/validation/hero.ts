import { z } from "zod";

const optionalString = z.string().trim().optional();
const optionalBoolean = z.boolean().optional();

export const heroWriteSchema = z.object({
  eyebrow: optionalString,
  heading: z.string().trim().min(1),
  subheading: optionalString,
  primaryCtaLabel: optionalString,
  primaryCtaUrl: optionalString,
  secondaryCtaLabel: optionalString,
  secondaryCtaUrl: optionalString,
  image: optionalString,
  backgroundType: z.enum(["color", "image"]).optional(),
  backgroundColor: optionalString,
  backgroundImage: optionalString,
  animated: optionalBoolean,
  published: optionalBoolean
});
export const heroUpdateSchema = heroWriteSchema.partial();

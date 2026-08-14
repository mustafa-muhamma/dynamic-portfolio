import { z } from "zod";

const optionalString = z.string().trim().optional();
const optionalNumber = z.number().optional();
const optionalBoolean = z.boolean().optional();
const optionalStringArray = z.array(z.string().trim()).optional();

export const galleryImageSchema = z.object({
  url: z.string().trim().min(1),
  originalUrl: z.string().trim().min(1)
});
const optionalGalleryImages = z.array(z.union([z.string().trim(), galleryImageSchema])).optional();

export const profileWriteSchema = z.object({
  name: z.string().trim().min(1),
  title: z.string().trim().min(1),
  tagline: optionalString,
  bio: optionalString,
  photo: optionalString,
  yearsExperience: z.number().int().min(0).optional(),
  contactEmail: z.string().trim().email()
});
export const profileUpdateSchema = profileWriteSchema.partial();

export const resumeWriteSchema = z.object({
  fileName: z.string().trim().min(1),
  fileUrl: z.string().trim().optional(),
  mimeType: optionalString,
  size: optionalNumber
});
export const resumeUpdateSchema = resumeWriteSchema.partial();

export const experienceWriteSchema = z.object({
  role: z.string().trim().min(1),
  company: z.string().trim().min(1),
  location: optionalString,
  start: optionalString,
  end: optionalString,
  current: optionalBoolean,
  summary: optionalString,
  bullets: optionalStringArray,
  order: optionalNumber,
  published: optionalBoolean
});
export const experienceUpdateSchema = experienceWriteSchema.partial();

export const educationWriteSchema = z.object({
  degree: z.string().trim().min(1),
  school: z.string().trim().min(1),
  start: optionalString,
  end: optionalString,
  summary: optionalString,
  order: optionalNumber,
  published: optionalBoolean
});
export const educationUpdateSchema = educationWriteSchema.partial();

export const skillWriteSchema = z.object({
  name: z.string().trim().min(1),
  category: optionalString,
  level: z.number().int().min(1).max(5),
  order: optionalNumber,
  published: optionalBoolean
});
export const skillUpdateSchema = skillWriteSchema.partial();

export const projectWriteSchema = z.object({
  title: z.string().trim().min(1),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, "Use lowercase letters, numbers, and dashes")
    .optional(),
  description: optionalString,
  role: optionalString,
  date: optionalString,
  link: optionalString,
  repo: optionalString,
  technologies: optionalStringArray,
  images: optionalGalleryImages,
  featured: optionalBoolean,
  inProgress: optionalBoolean,
  order: optionalNumber,
  published: optionalBoolean
});
export const projectUpdateSchema = projectWriteSchema.partial();

export const socialLinkWriteSchema = z.object({
  platform: z.string().trim().min(1),
  url: z.string().trim().url(),
  icon: optionalString,
  iconUrl: optionalString,
  order: optionalNumber,
  published: optionalBoolean
});
export const socialLinkUpdateSchema = socialLinkWriteSchema.partial();

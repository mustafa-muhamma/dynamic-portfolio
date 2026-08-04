import { Router } from "express";

import { createOne, deleteOne, updateOne, upsertOne } from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { ContactSettingsModel } from "../models/contactSettings.model.js";
import { EducationModel } from "../models/education.model.js";
import { ExperienceModel } from "../models/experience.model.js";
import { PricingModel } from "../models/pricing.model.js";
import { ProcessModel } from "../models/process.model.js";
import { ProfileModel } from "../models/profile.model.js";
import { ProjectModel } from "../models/project.model.js";
import { ResumeModel } from "../models/resume.model.js";
import { ServiceModel } from "../models/service.model.js";
import { SiteSettingsModel } from "../models/siteSettings.model.js";
import { SkillModel } from "../models/skill.model.js";
import { SocialLinkModel } from "../models/socialLink.model.js";
import { TestimonialModel } from "../models/testimonial.model.js";
import {
  contactSettingsUpdateSchema,
  contactSettingsWriteSchema,
  pricingUpdateSchema,
  pricingWriteSchema,
  processUpdateSchema,
  processWriteSchema,
  serviceUpdateSchema,
  serviceWriteSchema,
  siteSettingsUpdateSchema,
  siteSettingsWriteSchema,
  testimonialUpdateSchema,
  testimonialWriteSchema
} from "../validation/client.js";
import {
  educationUpdateSchema,
  educationWriteSchema,
  experienceUpdateSchema,
  experienceWriteSchema,
  profileUpdateSchema,
  profileWriteSchema,
  projectUpdateSchema,
  projectWriteSchema,
  resumeUpdateSchema,
  resumeWriteSchema,
  skillUpdateSchema,
  skillWriteSchema,
  socialLinkUpdateSchema,
  socialLinkWriteSchema
} from "../validation/recruiter.js";

const router = Router();

router.put(
  "/profile",
  requireAuth,
  upsertOne(ProfileModel, profileWriteSchema, profileUpdateSchema)
);
router.put("/resume", requireAuth, upsertOne(ResumeModel, resumeWriteSchema, resumeUpdateSchema));

router.post("/experience", requireAuth, createOne(ExperienceModel, experienceWriteSchema));
router.put("/experience/:id", requireAuth, updateOne(ExperienceModel, experienceUpdateSchema));
router.delete("/experience/:id", requireAuth, deleteOne(ExperienceModel, "Experience"));

router.post("/education", requireAuth, createOne(EducationModel, educationWriteSchema));
router.put("/education/:id", requireAuth, updateOne(EducationModel, educationUpdateSchema));
router.delete("/education/:id", requireAuth, deleteOne(EducationModel, "Education"));

router.post("/skills", requireAuth, createOne(SkillModel, skillWriteSchema));
router.put("/skills/:id", requireAuth, updateOne(SkillModel, skillUpdateSchema));
router.delete("/skills/:id", requireAuth, deleteOne(SkillModel, "Skill"));

router.post("/projects", requireAuth, createOne(ProjectModel, projectWriteSchema));
router.put("/projects/:id", requireAuth, updateOne(ProjectModel, projectUpdateSchema));
router.delete("/projects/:id", requireAuth, deleteOne(ProjectModel, "Project"));

router.post("/social-links", requireAuth, createOne(SocialLinkModel, socialLinkWriteSchema));
router.put("/social-links/:id", requireAuth, updateOne(SocialLinkModel, socialLinkUpdateSchema));
router.delete("/social-links/:id", requireAuth, deleteOne(SocialLinkModel, "Social link"));

router.put(
  "/contact-settings",
  requireAuth,
  upsertOne(ContactSettingsModel, contactSettingsWriteSchema, contactSettingsUpdateSchema)
);
router.put(
  "/site-settings",
  requireAuth,
  upsertOne(SiteSettingsModel, siteSettingsWriteSchema, siteSettingsUpdateSchema)
);

router.post("/services", requireAuth, createOne(ServiceModel, serviceWriteSchema));
router.put("/services/:id", requireAuth, updateOne(ServiceModel, serviceUpdateSchema));
router.delete("/services/:id", requireAuth, deleteOne(ServiceModel, "Service"));

router.post("/pricing", requireAuth, createOne(PricingModel, pricingWriteSchema));
router.put("/pricing/:id", requireAuth, updateOne(PricingModel, pricingUpdateSchema));
router.delete("/pricing/:id", requireAuth, deleteOne(PricingModel, "Pricing"));

router.post("/process", requireAuth, createOne(ProcessModel, processWriteSchema));
router.put("/process/:id", requireAuth, updateOne(ProcessModel, processUpdateSchema));
router.delete("/process/:id", requireAuth, deleteOne(ProcessModel, "Process step"));

router.post("/testimonials", requireAuth, createOne(TestimonialModel, testimonialWriteSchema));
router.put("/testimonials/:id", requireAuth, updateOne(TestimonialModel, testimonialUpdateSchema));
router.delete("/testimonials/:id", requireAuth, deleteOne(TestimonialModel, "Testimonial"));

export default router;

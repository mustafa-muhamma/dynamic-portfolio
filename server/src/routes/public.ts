import { Router } from "express";

import { createInquiry } from "../controllers/inquiry.controller.js";
import { getResumeDownload } from "../controllers/resume.controller.js";
import {
  getContactSettings,
  getHero,
  getProfile,
  getProjectBySlug,
  getPublicBundle,
  getResume,
  getSiteSettings,
  listEducation,
  listExperience,
  listPricing,
  listProcess,
  listProjects,
  listServices,
  listSkills,
  listSocialLinks,
  listTestimonials
} from "../controllers/public.controller.js";

const router = Router();

router.get("/bundle", getPublicBundle);
router.get("/social-links", listSocialLinks);
router.get("/experience", listExperience);
router.get("/education", listEducation);
router.get("/skills", listSkills);
router.get("/projects", listProjects);
router.get("/projects/:slug", getProjectBySlug);
router.get("/services", listServices);
router.get("/pricing", listPricing);
router.get("/process", listProcess);
router.get("/testimonials", listTestimonials);

router.get("/profile", getProfile);
router.get("/resume", getResume);
router.get("/resume/download", getResumeDownload);
router.get("/hero", getHero);
router.get("/contact-settings", getContactSettings);
router.get("/site-settings", getSiteSettings);

router.post("/inquiries", createInquiry);

export default router;

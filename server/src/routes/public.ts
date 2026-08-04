import { Router } from "express";

import {
  getContactSettings,
  getProfile,
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

router.get("/social-links", listSocialLinks);
router.get("/experience", listExperience);
router.get("/education", listEducation);
router.get("/skills", listSkills);
router.get("/projects", listProjects);
router.get("/services", listServices);
router.get("/pricing", listPricing);
router.get("/process", listProcess);
router.get("/testimonials", listTestimonials);

router.get("/profile", getProfile);
router.get("/resume", getResume);
router.get("/contact-settings", getContactSettings);
router.get("/site-settings", getSiteSettings);

export default router;

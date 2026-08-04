import type { Request, Response } from "express";

import { toApiDoc } from "../lib/serialize.js";
import type { LeanModel } from "../types/model.js";
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

function listController(model: LeanModel) {
  return async (_req: Request, res: Response): Promise<void> => {
    const docs = (await model.find({ published: true }).sort({ order: 1 }).lean()) as Array<{
      _id: unknown;
    }>;
    res.json(docs.map((doc) => toApiDoc(doc)));
  };
}

function singleController(model: LeanModel, label: string) {
  return async (_req: Request, res: Response): Promise<void> => {
    const doc = (await model.findOne().lean()) as { _id: unknown } | null;
    if (!doc) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: `${label} not found` }
      });
      return;
    }
    res.json(toApiDoc(doc));
  };
}

export const listSocialLinks = listController(SocialLinkModel);
export const listExperience = listController(ExperienceModel);
export const listEducation = listController(EducationModel);
export const listSkills = listController(SkillModel);
export const listProjects = listController(ProjectModel);
export const listServices = listController(ServiceModel);
export const listPricing = listController(PricingModel);
export const listProcess = listController(ProcessModel);
export const listTestimonials = listController(TestimonialModel);

export const getProfile = singleController(ProfileModel, "Profile");
export const getResume = singleController(ResumeModel, "Resume");
export const getContactSettings = singleController(ContactSettingsModel, "Contact settings");
export const getSiteSettings = singleController(SiteSettingsModel, "Site settings");

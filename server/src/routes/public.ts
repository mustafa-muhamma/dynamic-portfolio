import { Router } from "express";
import type { Model } from "mongoose";

import { toApiDoc } from "../lib/serialize.js";
import { EducationModel } from "../models/education.model.js";
import { ExperienceModel } from "../models/experience.model.js";
import { ProfileModel } from "../models/profile.model.js";
import { ProjectModel } from "../models/project.model.js";
import { ResumeModel } from "../models/resume.model.js";
import { SkillModel } from "../models/skill.model.js";
import { SocialLinkModel } from "../models/socialLink.model.js";

const router = Router();

function publishedList<T>(model: Model<T>, path: string): void {
  router.get(path, async (_req, res) => {
    const docs = await model.find({ published: true }).sort({ order: 1 }).lean();
    res.json(docs.map((doc) => toApiDoc(doc)));
  });
}

publishedList(SocialLinkModel, "/social-links");
publishedList(ExperienceModel, "/experience");
publishedList(EducationModel, "/education");
publishedList(SkillModel, "/skills");
publishedList(ProjectModel, "/projects");

router.get("/profile", async (_req, res) => {
  const profile = await ProfileModel.findOne().lean();
  if (!profile) {
    res.status(404).json({
      error: { code: "NOT_FOUND", message: "Profile not found" }
    });
    return;
  }
  res.json(toApiDoc(profile));
});

router.get("/resume", async (_req, res) => {
  const resume = await ResumeModel.findOne().lean();
  if (!resume) {
    res.status(404).json({
      error: { code: "NOT_FOUND", message: "Resume not found" }
    });
    return;
  }
  res.json(toApiDoc(resume));
});

export default router;

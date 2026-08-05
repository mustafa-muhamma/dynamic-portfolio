import mongoose from "mongoose";

import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";
import { ContactSettingsModel } from "../models/contactSettings.model.js";
import { EducationModel } from "../models/education.model.js";
import { ExperienceModel } from "../models/experience.model.js";
import { HeroModel } from "../models/hero.model.js";
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
import type { LeanModel } from "../types/model.js";

async function seedCollection(name: string, model: LeanModel, docs: object[]): Promise<void> {
  const removed = await model.deleteMany({});
  const inserted = docs.length > 0 ? await model.insertMany(docs) : [];
  logger.info(`[seed] ${name}: removed ${removed.deletedCount}, created ${inserted.length}`);
}

async function seedContent(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI);
  logger.info("[seed] connected; clearing existing content collections");

  await seedCollection("profile", ProfileModel, [
    {
      name: "Mustafa Muhammad",
      title: "Junior Software Developer",
      tagline: "Building modern web and mobile applications with React, Next.js, and Flutter.",
      bio: "Junior Software Developer with solid experience in building modern web and mobile applications. Specializing in React, Next.js, Flutter, and state-management solutions. Worked on real production projects and AI model evaluation, with a strong foundation in problem-solving, clean architecture, and delivering high-quality user experiences.",
      photo: "",
      resume: "",
      contactEmail: "mustafamuhammadert31@gmail.com"
    }
  ]);

  await seedCollection("resume", ResumeModel, [
    {
      fileName: "Mustafa-Muhammad-CV.pdf",
      fileUrl: "https://example.com/mustafa-muhammad-cv.pdf",
      mimeType: "application/pdf",
      size: 0
    }
  ]);

  await seedCollection("hero", HeroModel, [
    {
      eyebrow: "Hi, I'm",
      heading: "Mustafa Muhammad",
      subheading:
        "Junior Software Developer building modern web and mobile experiences with React, Next.js, and Flutter.",
      primaryCtaLabel: "View my work",
      primaryCtaUrl: "#work",
      secondaryCtaLabel: "Download resume",
      secondaryCtaUrl: "#resume",
      image: "",
      backgroundType: "color",
      backgroundColor: "#0a0a0a",
      backgroundImage: "",
      animated: true,
      published: true
    }
  ]);

  await seedCollection("skills", SkillModel, [
    { name: "React.js", category: "Frontend", level: 5, order: 0, published: true },
    { name: "Next.js", category: "Frontend", level: 4, order: 1, published: true },
    { name: "JavaScript (ES6+)", category: "Frontend", level: 5, order: 2, published: true },
    { name: "HTML5", category: "Frontend", level: 4, order: 3, published: true },
    { name: "CSS3", category: "Frontend", level: 4, order: 4, published: true },
    { name: "Tailwind CSS", category: "Frontend", level: 4, order: 5, published: true },
    { name: "Bootstrap", category: "Frontend", level: 4, order: 6, published: true },
    { name: "ShadCN UI", category: "Frontend", level: 4, order: 7, published: true },
    { name: "Vue.js", category: "Frontend", level: 3, order: 8, published: true },
    { name: "Responsive Design", category: "Frontend", level: 4, order: 9, published: true },
    { name: "Node.js", category: "Backend", level: 4, order: 10, published: true },
    { name: "Express.js", category: "Backend", level: 4, order: 11, published: true },
    { name: "RESTful APIs", category: "Backend", level: 4, order: 12, published: true },
    { name: "PHP", category: "Backend", level: 3, order: 13, published: true },
    { name: "Laravel", category: "Backend", level: 3, order: 14, published: true },
    { name: "MongoDB", category: "Database", level: 3, order: 15, published: true },
    { name: "Mongoose", category: "Database", level: 3, order: 16, published: true },
    { name: "MySQL", category: "Database", level: 3, order: 17, published: true },
    { name: "React Native", category: "Mobile Development", level: 4, order: 18, published: true },
    { name: "Flutter", category: "Mobile Development", level: 3, order: 19, published: true },
    { name: "Dart", category: "Mobile Development", level: 3, order: 20, published: true },
    { name: "Firebase", category: "Mobile Development", level: 3, order: 21, published: true },
    { name: "Redux", category: "State Management", level: 4, order: 22, published: true },
    { name: "Redux Saga", category: "State Management", level: 3, order: 23, published: true },
    { name: "Zustand", category: "State Management", level: 4, order: 24, published: true },
    { name: "Context API", category: "State Management", level: 4, order: 25, published: true },
    {
      name: "Problem Solving",
      category: "Programming Fundamentals",
      level: 5,
      order: 26,
      published: true
    },
    {
      name: "Data Structures",
      category: "Programming Fundamentals",
      level: 4,
      order: 27,
      published: true
    },
    { name: "OOP", category: "Programming Fundamentals", level: 4, order: 28, published: true },
    {
      name: "Algorithms",
      category: "Programming Fundamentals",
      level: 4,
      order: 29,
      published: true
    },
    { name: "Git", category: "DevOps & CI/CD", level: 4, order: 30, published: true },
    { name: "GitHub Actions", category: "DevOps & CI/CD", level: 3, order: 31, published: true },
    { name: "Vercel", category: "DevOps & CI/CD", level: 4, order: 32, published: true },
    { name: "Postman", category: "Tools", level: 4, order: 33, published: true },
    { name: "VS Code", category: "Tools", level: 5, order: 34, published: true }
  ]);

  await seedCollection("experience", ExperienceModel, [
    {
      role: "Full Stack Software Engineer",
      company: "Rawmart",
      location: "",
      start: "Jan 2026",
      end: "Aug 2026",
      current: false,
      summary:
        "Developing and maintaining scalable web applications across frontend and backend layers.",
      bullets: [
        "Contribute to the development and maintenance of scalable web applications across frontend and backend layers.",
        "Collaborate with cross-functional teams to deliver high-quality features that support business growth and platform performance.",
        "Implement clean, maintainable code while following best practices in software architecture and version control.",
        "Take ownership of assigned tasks, ensuring timely delivery, continuous improvement, and reliable system functionality.",
        "Support ongoing product development and optimization while continuously improving technical and problem-solving skills."
      ],
      order: 0,
      published: true
    },
    {
      role: "Freelance Frontend & Mobile Developer",
      company: "Mostaql, Nafezly",
      location: "Remote",
      start: "",
      end: "",
      current: true,
      summary: "Delivering client projects on Mostaql and Nafezly platforms.",
      bullets: [
        "Delivered multiple client projects on Mostaql and Nafezly platforms.",
        "Built responsive web interfaces and mobile app components."
      ],
      order: 1,
      published: true
    },
    {
      role: "Prompt Engineer / AI Trainer",
      company: "Outlier",
      location: "",
      start: "Mar 2024",
      end: "Dec 2024",
      current: false,
      summary: "Reviewing and improving AI-generated responses for accuracy and clarity.",
      bullets: [
        "Reviewed, tested, and improved AI-generated responses for accuracy and clarity.",
        "Analyzed prompt behavior and provided structured evaluations of AI outputs.",
        "Enhanced model quality through detailed feedback and error identification.",
        "Benchmarked AI responses for marketing and advertising use-cases."
      ],
      order: 2,
      published: true
    },
    {
      role: "ITP Trainee - Frontend & Cross-Platform Mobile Development",
      company: "Information Technology Institute (ITI)",
      location: "",
      start: "Jun 2024",
      end: "Nov 2024",
      current: false,
      summary:
        "Intensive Training Program (ITP) covering frontend and cross-platform mobile development.",
      bullets: [],
      order: 3,
      published: true
    },
    {
      role: "Supervisor",
      company: "Benchmark for Marketing & Advertising",
      location: "",
      start: "Dec 2020",
      end: "2021",
      current: false,
      summary: "",
      bullets: ["Managed event operations and coordinated on-site teams."],
      order: 4,
      published: true
    },
    {
      role: "Usher",
      company: "Benchmark for Marketing & Advertising",
      location: "",
      start: "2019",
      end: "",
      current: false,
      summary: "",
      bullets: ["Assisted in promotional events and customer engagement campaigns."],
      order: 5,
      published: true
    }
  ]);

  await seedCollection("education", EducationModel, [
    {
      degree: "Bachelor of Commerce - Accounting",
      school: "Alexandria University",
      start: "",
      end: "2023",
      summary: "Faculty of Commerce. Graduated with a Good grade.",
      order: 0,
      published: true
    }
  ]);

  await seedCollection("projects", ProjectModel, [
    {
      title: "Codexa Platform",
      description:
        "Full learning and community platform featuring authentication, course management, user dashboards, and interactive community features. ITI final project.",
      role: "Frontend Developer",
      link: "https://codexa-nine.vercel.app/",
      repo: "https://github.com/iti-frontend/Codexa",
      technologies: ["Next.js", "Zustand", "ShadCN UI"],
      images: [],
      featured: true,
      order: 0,
      published: true
    },
    {
      title: "Furnitura-React",
      description:
        "Responsive e-commerce frontend with product listing, cart functionality, dynamic filtering, and reusable components.",
      role: "Frontend Developer",
      link: "https://furnitura-react.vercel.app/",
      repo: "https://github.com/mustafa-muhamma/Furnitura-React",
      technologies: ["React.js", "Tailwind CSS", "Redux"],
      images: [],
      featured: false,
      order: 1,
      published: true
    },
    {
      title: "FilmVera Mobile App",
      description:
        "Cross-platform movie application built with React Native and Expo, with optimized UI components and dynamic content rendering.",
      role: "Mobile Developer",
      link: "",
      repo: "https://github.com/mustafa-muhamma/film_vera-mobile-app",
      technologies: ["React Native", "Expo", "Context API"],
      images: [],
      featured: false,
      order: 2,
      published: true
    },
    {
      title: "Egypt Stock Market Demo",
      description: "Modern stock market dashboard built with Next.js and API integrations.",
      role: "Frontend Developer",
      link: "https://egypt-stock-market-demo.vercel.app/",
      repo: "https://github.com/mustafa-muhamma/egypt-stock-market-demo",
      technologies: ["Next.js"],
      images: [],
      featured: false,
      order: 3,
      published: true
    }
  ]);

  await seedCollection("social-links", SocialLinkModel, [
    { platform: "GitHub", url: "https://github.com/mustafa-muhamma", order: 0, published: true },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/mustafa-muhammad-6370b821b/",
      order: 1,
      published: true
    },
    {
      platform: "Email",
      url: "mailto:mustafamuhammadert31@gmail.com",
      order: 2,
      published: true
    }
  ]);

  await seedCollection("services", ServiceModel, [
    {
      name: "Web Development",
      description: "Modern, responsive web applications built with React, Next.js, and Node.js.",
      deliverables: ["Responsive websites", "Next.js applications", "REST API integration"],
      price: 0,
      order: 0,
      published: true
    },
    {
      name: "Mobile App Development",
      description: "Cross-platform mobile apps with React Native and Flutter.",
      deliverables: ["React Native apps", "Flutter apps", "Firebase integration"],
      price: 0,
      order: 1,
      published: true
    },
    {
      name: "Frontend Development & UI Implementation",
      description: "Pixel-perfect, accessible interfaces from design to code.",
      deliverables: ["UI implementation", "Design systems", "State management"],
      price: 0,
      order: 2,
      published: true
    }
  ]);

  await seedCollection("pricing", PricingModel, []);

  await seedCollection("process", ProcessModel, [
    {
      step: 1,
      title: "Discovery",
      description: "We map goals, audience, and scope so the build solves the right problem.",
      order: 0,
      published: true
    },
    {
      step: 2,
      title: "Design",
      description: "Wireframes and visual design that match your brand and convert visitors.",
      order: 1,
      published: true
    },
    {
      step: 3,
      title: "Build",
      description: "Clean, tested code shipped in weekly milestones you can see live.",
      order: 2,
      published: true
    },
    {
      step: 4,
      title: "Launch",
      description: "Deployment, SEO, and analytics wiring so your site is ready for traffic.",
      order: 3,
      published: true
    },
    {
      step: 5,
      title: "Support",
      description: "Post-launch care, updates, and improvements as your product evolves.",
      order: 4,
      published: true
    }
  ]);

  await seedCollection("testimonials", TestimonialModel, []);

  await seedCollection("contact-settings", ContactSettingsModel, [
    {
      email: "mustafamuhammadert31@gmail.com",
      phone: "01281201920",
      availability: "Available for full-time and remote opportunities",
      location: "Alexandria, Egypt (Easy Relocation)",
      formEnabled: true
    }
  ]);

  await seedCollection("site-settings", SiteSettingsModel, [
    {
      siteName: "Mustafa Muhammad",
      tagline: "Junior Software Developer",
      navigationLabels: {
        home: "Home",
        work: "Work",
        services: "Services",
        about: "About",
        contact: "Contact"
      },
      sectionVisibility: [
        { key: "work", label: "Selected Work", enabled: true },
        { key: "services", label: "Services", enabled: true },
        { key: "about", label: "About", enabled: true },
        { key: "contact", label: "Contact", enabled: true }
      ]
    }
  ]);

  logger.info("[seed] content seed complete");
  await mongoose.disconnect();
  process.exit(0);
}

seedContent().catch((err: unknown) => {
  logger.error({ err }, "[seed] content seed failed");
  process.exit(1);
});

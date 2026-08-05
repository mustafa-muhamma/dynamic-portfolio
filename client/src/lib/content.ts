export type ApiDoc<T> = T & { id: string };

export type Profile = ApiDoc<{
  name: string;
  title: string;
  tagline?: string;
  bio?: string;
  photo?: string;
  resume?: string;
  contactEmail: string;
}>;

export type Resume = ApiDoc<{
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  size?: number;
}>;

export type Hero = ApiDoc<{
  eyebrow?: string;
  heading: string;
  subheading?: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  image?: string;
  backgroundType?: "color" | "image";
  backgroundColor?: string;
  backgroundImage?: string;
  animated?: boolean;
  published?: boolean;
}>;

export type Experience = ApiDoc<{
  role: string;
  company: string;
  location?: string;
  start?: string;
  end?: string;
  current?: boolean;
  summary?: string;
  bullets?: string[];
  order?: number;
  published?: boolean;
}>;

export type Education = ApiDoc<{
  degree: string;
  school: string;
  start?: string;
  end?: string;
  summary?: string;
  order?: number;
  published?: boolean;
}>;

export type Skill = ApiDoc<{
  name: string;
  category?: string;
  level: number;
  order?: number;
  published?: boolean;
}>;

export type Project = ApiDoc<{
  title: string;
  description?: string;
  role?: string;
  link?: string;
  repo?: string;
  technologies?: string[];
  images?: string[];
  featured?: boolean;
  order?: number;
  published?: boolean;
}>;

export type SocialLink = ApiDoc<{
  platform: string;
  url: string;
  order?: number;
  published?: boolean;
}>;

export type Service = ApiDoc<{
  name: string;
  description?: string;
  deliverables?: string[];
  price?: number;
  order?: number;
  published?: boolean;
}>;

export type Pricing = ApiDoc<{
  tier: string;
  price?: number;
  period?: string;
  features?: string[];
  order?: number;
  published?: boolean;
}>;

export type Process = ApiDoc<{
  step: number;
  title: string;
  description?: string;
  order?: number;
  published?: boolean;
}>;

export type Testimonial = ApiDoc<{
  author: string;
  role?: string;
  company?: string;
  quote: string;
  avatar?: string;
  order?: number;
  published?: boolean;
}>;

export type ContactSettings = ApiDoc<{
  email?: string;
  phone?: string;
  availability?: string;
  location?: string;
  formEnabled?: boolean;
}>;

export type SiteSettings = ApiDoc<{
  siteName: string;
  tagline?: string;
  navigationLabels?: Record<string, string>;
  sectionVisibility?: { key: string; label: string; enabled: boolean }[];
}>;

export type Inquiry = ApiDoc<{
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt?: string;
}>;

export const COLLECTIONS = {
  experience: "experience",
  education: "education",
  skills: "skills",
  projects: "projects",
  "social-links": "social-links",
  services: "services",
  pricing: "pricing",
  process: "process",
  testimonials: "testimonials"
} as const;

export const SINGLETONS = {
  profile: "profile",
  resume: "resume",
  hero: "hero",
  "contact-settings": "contact-settings",
  "site-settings": "site-settings"
} as const;

export const INQUIRIES = "inquiries";

export type ContentResource = keyof typeof COLLECTIONS;
export type SingletonResource = keyof typeof SINGLETONS;

export type CollectionDoc = {
  experience: Experience;
  education: Education;
  skills: Skill;
  projects: Project;
  "social-links": SocialLink;
  services: Service;
  pricing: Pricing;
  process: Process;
  testimonials: Testimonial;
};

export type SingletonDoc = {
  profile: Profile;
  resume: Resume;
  hero: Hero;
  "contact-settings": ContactSettings;
  "site-settings": SiteSettings;
};

export type CreateDoc<T extends { id: string }> = Omit<T, "id">;
export type UpdateDoc<T extends { id: string }> = Partial<Omit<T, "id">>;

export type SectionKey =
  | "about"
  | "experience"
  | "skills"
  | "projects"
  | "services"
  | "pricing"
  | "process"
  | "testimonials"
  | "contact";

export type Audience = "recruiter" | "client" | "both";

export const SECTION_ORDER: SectionKey[] = [
  "about",
  "experience",
  "skills",
  "projects",
  "services",
  "pricing",
  "process",
  "testimonials",
  "contact"
];

export const SECTION_META: Record<SectionKey, { href: string; label: string; audience: Audience }> =
  {
    about: { href: "#about", label: "About", audience: "both" },
    experience: { href: "#experience", label: "Experience", audience: "recruiter" },
    skills: { href: "#skills", label: "Skills", audience: "recruiter" },
    projects: { href: "#projects", label: "Work", audience: "both" },
    services: { href: "#services", label: "Services", audience: "client" },
    pricing: { href: "#pricing", label: "Pricing", audience: "client" },
    process: { href: "#process", label: "Process", audience: "client" },
    testimonials: { href: "#testimonials", label: "Testimonials", audience: "client" },
    contact: { href: "#contact", label: "Contact", audience: "both" }
  };

type NavKey = "home" | SectionKey | "work" | "projects";

const KEY_META: Record<NavKey, { href: string; label: string }> = {
  home: { href: "#top", label: "Home" },
  about: SECTION_META.about,
  experience: SECTION_META.experience,
  skills: SECTION_META.skills,
  work: { href: "#projects", label: "Work" },
  projects: { href: "#projects", label: "Projects" },
  services: SECTION_META.services,
  pricing: SECTION_META.pricing,
  process: SECTION_META.process,
  testimonials: SECTION_META.testimonials,
  contact: SECTION_META.contact
};

const NAV_PREFERRED: NavKey[] = ["home", "about", "work", "services", "contact"];

export type NavItem = { key: string; href: string; label: string };

export function getNavItems(navigationLabels?: Record<string, string> | null): NavItem[] {
  const entries = Object.entries(navigationLabels ?? {});
  if (entries.length > 0) {
    const known = entries
      .filter(([key]) => key in KEY_META)
      .map(([key, label]) => ({
        key,
        href: KEY_META[key as NavKey].href,
        label: label.trim() || KEY_META[key as NavKey].label
      }));
    if (known.length > 0) return known;
  }
  return NAV_PREFERRED.filter((key) => key in KEY_META).map((key) => ({
    key,
    href: KEY_META[key].href,
    label: KEY_META[key].label
  }));
}

export function isSectionEnabled(
  visibility: { key: string; enabled: boolean }[] | undefined | null,
  key: SectionKey
): boolean {
  if (!visibility || visibility.length === 0) return true;
  const item = visibility.find((v) => v.key === key);
  return item ? item.enabled : true;
}

"use client";

import { useQuery } from "@tanstack/react-query";

import {
  type ContactSettings,
  type Education,
  type Experience,
  type Hero,
  type Pricing,
  type Process,
  type Profile,
  type Project,
  type Resume,
  type Service,
  type SiteSettings,
  type Skill,
  type SocialLink,
  type Testimonial
} from "@/lib/content";
import { getResource, getSingleton, listResource } from "@/lib/public-api";

const publicOptions = {
  staleTime: 0,
  refetchOnWindowFocus: true
} as const;

function usePublicList<T>(key: string, path: string) {
  return useQuery<T[]>({
    queryKey: ["public", key],
    queryFn: () => listResource<T>(path),
    ...publicOptions
  });
}

function usePublicSingleton<T>(key: string, path: string) {
  return useQuery<T | undefined>({
    queryKey: ["public", key],
    queryFn: () => getSingleton<T>(path),
    ...publicOptions
  });
}

export function useProfile() {
  return usePublicSingleton<Profile>("/profile", "/profile");
}

export function useHero() {
  return usePublicSingleton<Hero>("/hero", "/hero");
}

export function useResume() {
  return usePublicSingleton<Resume>("/resume", "/resume");
}

export function useResumeDownloadUrl() {
  const { data: resume } = useResume();
  const { data: profile } = useProfile();
  const hasStoredResume = Boolean(resume?.fileName || resume?.fileUrl);
  const resumeUrl = hasStoredResume ? "/api/public/resume/download" : profile?.resume?.trim() || "";
  return { resumeUrl, hasStoredResume };
}

export function useContactSettings() {
  return usePublicSingleton<ContactSettings>("/contact-settings", "/contact-settings");
}

export function useSiteSettings() {
  return usePublicSingleton<SiteSettings>("/site-settings", "/site-settings");
}

export function useSocialLinks() {
  return usePublicList<SocialLink>("/social-links", "/social-links");
}

export function useExperience() {
  return usePublicList<Experience>("/experience", "/experience");
}

export function useEducation() {
  return usePublicList<Education>("/education", "/education");
}

export function useSkills() {
  return usePublicList<Skill>("/skills", "/skills");
}

export function useProjects() {
  return usePublicList<Project>("/projects", "/projects");
}

export function useProjectBySlug(slug?: string) {
  return useQuery<Project | undefined>({
    queryKey: ["public", "project", slug],
    queryFn: () => getResource<Project>(`/projects/${encodeURIComponent(slug ?? "")}`),
    enabled: Boolean(slug),
    ...publicOptions
  });
}

export function useServices() {
  return usePublicList<Service>("/services", "/services");
}

export function usePricing() {
  return usePublicList<Pricing>("/pricing", "/pricing");
}

export function useProcess() {
  return usePublicList<Process>("/process", "/process");
}

export function useTestimonials() {
  return usePublicList<Testimonial>("/testimonials", "/testimonials");
}

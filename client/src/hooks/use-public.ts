"use client";

import { useQuery } from "@tanstack/react-query";

import type { Project, PublicBundle } from "@/lib/content";
import { getPublicBundle, getResource } from "@/lib/public-api";

const publicOptions = {
  staleTime: 0,
  refetchOnWindowFocus: true
} as const;

function usePublicSlice<T>(select: (bundle: PublicBundle) => T) {
  return useQuery<PublicBundle, Error, T>({
    queryKey: ["public", "bundle"],
    queryFn: getPublicBundle,
    ...publicOptions,
    select
  });
}

export function useProfile() {
  return usePublicSlice((bundle) => bundle.profile ?? undefined);
}

export function useHero() {
  return usePublicSlice((bundle) => bundle.hero ?? undefined);
}

export function useResume() {
  return usePublicSlice((bundle) => bundle.resume ?? undefined);
}

export function useResumeDownloadUrl() {
  const { data: resume } = useResume();
  const hasStoredResume = Boolean(resume?.fileName || resume?.fileUrl);
  const resumeUrl = hasStoredResume ? "/api/public/resume/download" : "";
  return { resumeUrl, hasStoredResume };
}

export function useContactSettings() {
  return usePublicSlice((bundle) => bundle.contactSettings ?? undefined);
}

export function useSiteSettings() {
  return usePublicSlice((bundle) => bundle.siteSettings ?? undefined);
}

export function useSocialLinks() {
  return usePublicSlice((bundle) => bundle.socialLinks ?? []);
}

export function useExperience() {
  return usePublicSlice((bundle) => bundle.experience ?? []);
}

export function useEducation() {
  return usePublicSlice((bundle) => bundle.education ?? []);
}

export function useSkills() {
  return usePublicSlice((bundle) => bundle.skills ?? []);
}

export function useProjects() {
  return usePublicSlice((bundle) => bundle.projects ?? []);
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
  return usePublicSlice((bundle) => bundle.services ?? []);
}

export function usePricing() {
  return usePublicSlice((bundle) => bundle.pricing ?? []);
}

export function useProcess() {
  return usePublicSlice((bundle) => bundle.process ?? []);
}

export function useTestimonials() {
  return usePublicSlice((bundle) => bundle.testimonials ?? []);
}

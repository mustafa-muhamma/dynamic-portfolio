"use client";

import { useState } from "react";
import { Check, Copy, Download, GraduationCap, Mail, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

import {
  GradientOrbs,
  Magnetic,
  Reveal,
  Stagger,
  StaggerItem,
  TiltCard
} from "@/components/public/motion";
import { Section, SectionHeading } from "@/components/public/section";
import {
  useContactSettings,
  useEducation,
  useProfile,
  useResumeDownloadUrl
} from "@/hooks/use-public";
import { cn } from "@/lib/utils";

function formatYearRange(start?: string, end?: string): string {
  const from = start ? new Date(start).getFullYear() : "";
  const to = end ? new Date(end).getFullYear() : "";
  if (from && to) return `${from} — ${to}`;
  if (from) return `${from} — Present`;
  return "";
}

export function About() {
  const { data: profile } = useProfile();
  const { resumeUrl, hasStoredResume } = useResumeDownloadUrl();
  const { data: settings } = useContactSettings();
  const { data: education } = useEducation();

  const photo = profile?.photo || "";
  const bio = profile?.bio?.trim() || "";
  const bioParagraphs = bio.split(/\n+/).filter(Boolean);
  const email = profile?.contactEmail?.trim() || "";

  const [copiedLabel, setCopiedLabel] = useState<string>();

  async function copyText(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedLabel(label);
      window.setTimeout(() => setCopiedLabel((l) => (l === label ? undefined : l)), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  const facts = [
    {
      icon: Sparkles,
      label: "Experience",
      value: typeof profile?.yearsExperience === "number" ? `${profile.yearsExperience}+ years` : ""
    },
    { icon: MapPin, label: "Location", value: settings?.location?.trim() || "" },
    {
      icon: Mail,
      label: "Email",
      value: email,
      href: email ? `mailto:${email}` : undefined,
      copyValue: email
    },
    {
      icon: GraduationCap,
      label: "Education",
      value: education?.length ? `${education.length} degrees` : ""
    }
  ].filter((fact) => fact.value);

  const educationItems = education
    ? [...education].sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
    : [];

  return (
    <Section id="about" className="relative py-24 md:py-32">
      <GradientOrbs className="opacity-40 dark:opacity-60" />

      <div className="relative">
        <SectionHeading
          eyebrow="About"
          title={profile?.tagline?.trim() || profile?.name || "About me"}
          description={profile?.title}
        />

        <div
          className={cn(
            "grid items-center gap-14",
            photo ? "md:grid-cols-[0.9fr_1.1fr] md:gap-16 lg:gap-24" : "md:grid-cols-1"
          )}
        >
          {photo ? (
            <Reveal className="relative mx-auto w-full max-w-sm lg:max-w-md">
              <div className="absolute -inset-16 rounded-full bg-gradient-brand/15 blur-3xl dark:bg-gradient-brand/25" />
              <TiltCard maxTilt={8} className="rounded-3xl">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-[2px]">
                  <div className="overflow-hidden rounded-[calc(1.5rem-2px)]">
                    <img
                      src={photo}
                      alt={profile?.name ?? "Portrait"}
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-background/50 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                </div>
              </TiltCard>

              {typeof profile?.yearsExperience === "number" ? (
                <Reveal
                  delay={0.25}
                  className="glass-card absolute -bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-2xl px-5 py-3 shadow-lg"
                >
                  <span className="font-heading text-2xl font-bold text-gradient-brand">
                    {profile.yearsExperience}+
                  </span>
                  <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    years of experience
                  </span>
                </Reveal>
              ) : null}
            </Reveal>
          ) : null}

          <div className={cn(!photo && "mx-auto w-full max-w-3xl")}>
            {bioParagraphs.length > 0 ? (
              <Stagger className="space-y-4">
                {bioParagraphs.map((paragraph, index) => (
                  <StaggerItem
                    key={index}
                    className="text-base leading-relaxed text-muted-foreground md:text-lg"
                  >
                    {paragraph}
                  </StaggerItem>
                ))}
              </Stagger>
            ) : null}

            {facts.length > 0 ? (
              <Stagger className="mt-8 grid grid-cols-2 gap-4">
                {facts.map((fact) => (
                  <StaggerItem
                    key={fact.label}
                    className="flex items-start gap-3 rounded-xl border border-border p-3.5"
                  >
                    <fact.icon className="mt-0.5 size-4 shrink-0 text-brand-2" />
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                        {fact.label}
                      </p>
                      {fact.href ? (
                        <a
                          href={fact.href}
                          className="block break-all text-sm font-semibold text-foreground transition-colors hover:text-brand-2"
                        >
                          {fact.value}
                        </a>
                      ) : (
                        <p className="line-clamp-2 text-sm font-semibold text-foreground">
                          {fact.value}
                        </p>
                      )}
                    </div>
                    {fact.copyValue ? (
                      <button
                        type="button"
                        onClick={() => copyText(fact.copyValue, fact.label)}
                        className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label={`Copy ${fact.label}`}
                      >
                        {copiedLabel === fact.label ? (
                          <Check className="size-3.5 text-brand-2" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    ) : null}
                  </StaggerItem>
                ))}
              </Stagger>
            ) : null}

            {resumeUrl ? (
              <Reveal delay={0.15} className="mt-10">
                <Magnetic>
                  {hasStoredResume ? (
                    <a
                      href={resumeUrl}
                      className="btn-gradient group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
                    >
                      <Download className="size-4 transition-transform group-hover:translate-y-0.5" />
                      Download resume
                    </a>
                  ) : (
                    <Link
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-gradient group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
                    >
                      <Download className="size-4 transition-transform group-hover:translate-y-0.5" />
                      Download resume
                    </Link>
                  )}
                </Magnetic>
              </Reveal>
            ) : null}
          </div>
        </div>

        {educationItems.length > 0 ? (
          <div className="mt-20">
            <Reveal className="mb-8 flex items-center gap-3">
              <GraduationCap className="size-5 text-brand-2" />
              <h3 className="font-heading text-xl font-semibold tracking-tight">Education</h3>
              <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
            </Reveal>
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {educationItems.map((item) => {
                const range = formatYearRange(item.start, item.end);
                return (
                  <StaggerItem
                    key={item.id}
                    className="rounded-2xl border border-border p-5 transition-colors hover:border-brand-1"
                  >
                    <p className="font-heading text-lg font-semibold text-foreground">
                      {item.degree}
                    </p>
                    <p className="mt-1 text-sm text-brand-2">{item.school}</p>
                    {range ? (
                      <p className="mt-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        {range}
                      </p>
                    ) : null}
                    {item.summary ? (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {item.summary}
                      </p>
                    ) : null}
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        ) : null}
      </div>
    </Section>
  );
}

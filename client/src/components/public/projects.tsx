"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Folder,
  GitFork,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { GradientOrbs, Stagger, StaggerItem } from "@/components/public/motion";
import { Section, SectionHeading } from "@/components/public/section";
import { useProjects } from "@/hooks/use-public";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

const SLIDE_INTERVAL = 4500;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function projectHref(project: Project): string {
  return `/projects/${project.slug?.trim() || slugify(project.id)}`;
}

function formatMonth(value?: string): string {
  if (!value) return "";
  const match = value.trim().match(/^(\d{4})-(\d{2})$/);
  if (match) {
    const date = new Date(Number(match[1]), Number(match[2]) - 1);
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
  }
  return value;
}

function ProjectCover({ project, href }: { project: Project; href: string }) {
  const images = project.images ?? [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [images.length, paused]);

  const badges = (
    <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
      {project.featured ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
          <Sparkles className="size-3 text-brand-1" />
          Featured
        </span>
      ) : null}
      {project.inProgress ? (
        <span className="rounded-full bg-brand-2/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          In progress
        </span>
      ) : null}
    </div>
  );

  if (images.length === 0) {
    return (
      <Link
        href={href}
        className="group relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-brand/10"
      >
        <div
          aria-hidden="true"
          className="absolute -inset-10 rounded-full bg-gradient-brand/20 blur-3xl transition-transform duration-500 group-hover:scale-110"
        />
        <Folder className="relative size-12 text-brand-2" />
        {badges}
      </Link>
    );
  }

  return (
    <div
      className="relative aspect-[16/10] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Link href={href} className="absolute inset-0 z-10">
        <AnimatePresence initial={false}>
          <motion.img
            key={index}
            src={images[index]}
            alt={`${project.title} — screenshot ${index + 1}`}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"
        />
      </Link>

      {badges}

      {images.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            className="absolute top-1/2 left-3 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-background"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            className="absolute top-1/2 right-3 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-background"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "size-1.5 rounded-full transition-all",
                  i === index ? "w-5 bg-brand-2" : "bg-background/60 hover:bg-background"
                )}
              />
            ))}
          </div>
          <span className="absolute top-3 right-3 z-20 rounded-full bg-background/80 px-2 py-0.5 font-mono text-[11px] text-muted-foreground backdrop-blur">
            {index + 1} / {images.length}
          </span>
        </>
      ) : null}
    </div>
  );
}

export function Projects() {
  const { data: projects } = useProjects();

  const items = projects
    ? [...projects]
        .sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
        .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
    : [];

  if (items.length === 0) return null;

  return (
    <Section id="projects" className="relative py-24 md:py-32">
      <GradientOrbs className="opacity-30 dark:opacity-50" />

      <div className="relative">
        <SectionHeading
          eyebrow="Work"
          title="Featured projects"
          description="A selection of things I have designed and built, with the problems they solve."
        />

        <Stagger className="grid gap-6 lg:grid-cols-2">
          {items.map((item) => {
            const href = projectHref(item);
            const date = formatMonth(item.date);
            return (
              <StaggerItem
                key={item.id}
                className="group overflow-hidden rounded-3xl border border-border bg-background/60 backdrop-blur transition-colors hover:border-brand-1"
              >
                <ProjectCover project={item} href={href} />

                <div className="p-6 md:p-7">
                  <Link href={href} className="inline-block">
                    <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand-1">
                      {item.title}
                    </h3>
                  </Link>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {item.role ? (
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-2">
                        {item.role}
                      </span>
                    ) : null}
                    {date ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {date}
                      </span>
                    ) : null}
                  </div>

                  {item.description ? (
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}

                  {item.technologies && item.technologies.length > 0 ? (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {item.technologies.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-gradient inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                      >
                        View project
                        <ArrowUpRight className="size-4" />
                      </a>
                    ) : null}
                    {item.repo ? (
                      <a
                        href={item.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand-2 hover:text-brand-2"
                      >
                        <GitFork className="size-4" />
                        Source
                      </a>
                    ) : null}
                    <Link
                      href={href}
                      className="ml-auto text-sm font-semibold text-brand-1 transition-colors hover:text-brand-2"
                    >
                      Case study →
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}

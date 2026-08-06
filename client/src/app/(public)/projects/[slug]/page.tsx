"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Folder,
  GitFork,
  Sparkles,
  UserRound
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { GradientOrbs, Reveal } from "@/components/public/motion";
import { useProjectBySlug } from "@/hooks/use-public";
import { cn } from "@/lib/utils";

function formatMonth(value?: string): string {
  if (!value) return "";
  const match = value.trim().match(/^(\d{4})-(\d{2})$/);
  if (match) {
    const date = new Date(Number(match[1]), Number(match[2]) - 1);
    return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
  }
  return value;
}

function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-3xl bg-gradient-brand/10">
        <div
          aria-hidden="true"
          className="absolute -inset-10 rounded-full bg-gradient-brand/20 blur-3xl"
        />
        <Folder className="relative size-16 text-brand-2" />
      </div>
    );
  }

  return (
    <div>
      <div className="group relative overflow-hidden rounded-3xl border border-border">
        <div className="relative aspect-[16/10]">
          <AnimatePresence initial={false}>
            <motion.img
              key={index}
              src={images[index]}
              alt={`${title} — screenshot ${index + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10 ring-inset"
        />

        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute top-1/2 left-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-background"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              className="absolute top-1/2 right-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-background"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="absolute bottom-4 left-4 rounded-full bg-background/80 px-2.5 py-1 font-mono text-xs text-muted-foreground backdrop-blur">
              {index + 1} / {images.length}
            </span>
          </>
        ) : null}

        {images.length > 1 ? (
          <div className="absolute right-4 bottom-4 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "size-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-brand-2" : "bg-background/60 hover:bg-background"
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                i === index ? "border-brand-2" : "border-border opacity-60 hover:opacity-100"
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isPending } = useProjectBySlug(slug);

  if (isPending) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-12 w-2/3 rounded-lg bg-muted" />
          <div className="aspect-[16/10] rounded-3xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-28 text-center md:py-40">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-1">404</p>
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-5xl">
          Project not found
        </h1>
        <p className="mt-4 text-muted-foreground">
          This project may have been unpublished or removed.
        </p>
        <Link
          href="/#projects"
          className="btn-gradient mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft className="size-4" />
          Back to all projects
        </Link>
      </div>
    );
  }

  const date = formatMonth(project.date);
  const technologies = project.technologies ?? [];

  return (
    <div className="relative">
      <GradientOrbs className="opacity-30 dark:opacity-50" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-brand-1"
        >
          <ArrowLeft className="size-4" />
          All projects
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-brand-1">
                  Case study
                </span>
                {project.featured ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-brand-1/40 bg-brand-1/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-1">
                    <Sparkles className="size-3" />
                    Featured
                  </span>
                ) : null}
                {project.inProgress ? (
                  <span className="rounded-full bg-brand-2 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    In progress
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-balance md:text-6xl">
                {project.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                {project.role ? (
                  <span className="inline-flex items-center gap-2">
                    <UserRound className="size-4" />
                    {project.role}
                  </span>
                ) : null}
                {date ? (
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="size-4" />
                    {date}
                  </span>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-8">
              <Gallery images={project.images ?? []} title={project.title} />
            </Reveal>

            {project.description ? (
              <Reveal delay={0.15} className="mt-10 max-w-3xl">
                <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                  About this project
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {project.description}
                </p>
              </Reveal>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal className="rounded-3xl border border-border bg-background/60 p-6 backdrop-blur md:p-7">
              {technologies.length > 0 ? (
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-1">
                    Stack
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {project.link || project.repo ? (
                <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-gradient inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white"
                    >
                      View live project
                      <ArrowUpRight className="size-4" />
                    </a>
                  ) : null}
                  {project.repo ? (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-2 hover:text-brand-2"
                    >
                      <GitFork className="size-4" />
                      View source code
                    </a>
                  ) : null}
                </div>
              ) : null}
            </Reveal>
          </aside>
        </div>
      </div>
    </div>
  );
}

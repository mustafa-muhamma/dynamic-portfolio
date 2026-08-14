"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Expand,
  Folder,
  GitFork,
  Sparkles,
  UserRound,
  X
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { GradientOrbs, Reveal } from "@/components/public/motion";
import { useProjectBySlug, useTestimonials } from "@/hooks/use-public";
import type { GalleryImage } from "@/lib/content";
import { normalizeGalleryImages } from "@/lib/images";
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

function Gallery({ images, title }: { images: (string | GalleryImage)[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gallery = normalizeGalleryImages(images);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
        return;
      }
      if (gallery.length <= 1) return;
      if (e.key === "ArrowLeft") {
        setLightboxIndex((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length));
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((i) => (i === null ? i : (i + 1) % gallery.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, gallery.length]);

  if (gallery.length === 0) {
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
    <>
      <div>
        <div className="group relative overflow-hidden rounded-3xl border border-border">
          <div className="relative aspect-[16/10]">
            <AnimatePresence initial={false}>
              <motion.img
                key={index}
                src={gallery[index].url}
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

          <button
            type="button"
            aria-label="View full image"
            onClick={() => setLightboxIndex(index)}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-background/70 text-foreground opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-background">
              <Expand className="size-5" />
            </span>
          </button>

          {gallery.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => setIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                className="absolute top-1/2 left-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-background"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => setIndex((i) => (i + 1) % gallery.length)}
                className="absolute top-1/2 right-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-background"
              >
                <ChevronRight className="size-5" />
              </button>
              <span className="absolute bottom-4 left-4 rounded-full bg-background/80 px-2.5 py-1 font-mono text-xs text-muted-foreground backdrop-blur">
                {index + 1} / {gallery.length}
              </span>
            </>
          ) : null}

          {gallery.length > 1 ? (
            <div className="absolute right-4 bottom-4 flex gap-1.5">
              {gallery.map((_, i) => (
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

        {gallery.length > 1 ? (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {gallery.map((image, i) => (
              <button
                key={image.url}
                type="button"
                aria-label={`Show image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                  i === index ? "border-brand-2" : "border-border opacity-60 hover:opacity-100"
                )}
              >
                <img src={image.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {lightboxIndex !== null && gallery.length > 0 ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Full image ${lightboxIndex + 1} of ${gallery.length}`}
        >
          <button
            type="button"
            aria-label="Close full image"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
          {gallery.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
                }}
                className="absolute top-1/2 left-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % gallery.length);
                }}
                className="absolute top-1/2 right-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}
          <img
            src={gallery[lightboxIndex].originalUrl}
            alt={`${title} — full image ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
          />
          {gallery.length > 1 ? (
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-white">
              {lightboxIndex + 1} / {gallery.length}
            </span>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function ProjectReviews({ projectId }: { projectId: string }) {
  const { data: testimonials } = useTestimonials();
  const reviews = (testimonials ?? []).filter((item) => item.projectId === projectId);

  if (reviews.length === 0) return null;

  return (
    <Reveal className="mt-14">
      <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
        Client reviews
      </h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {reviews.map((review) => {
          const author = review.author?.trim() || "";
          const role = review.role?.trim() || "";
          const company = review.company?.trim() || "";
          const quote = review.quote?.trim() || "";
          const hasIdentity = Boolean(author || review.avatar || role || company);
          return (
            <figure
              key={review.id}
              className="flex flex-col rounded-3xl border border-border bg-background/60 p-7 backdrop-blur"
            >
              {quote ? (
                <blockquote className="text-base leading-relaxed text-foreground">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              ) : null}
              {review.images && normalizeGalleryImages(review.images).length > 0 ? (
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {normalizeGalleryImages(review.images).map((image, index) => (
                    <div key={index} className="overflow-hidden rounded-lg border border-border">
                      <img
                        src={image.url}
                        alt={`Proof screenshot ${index + 1}`}
                        className="aspect-video w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              {hasIdentity ? (
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  {review.avatar ? (
                    <img
                      src={review.avatar}
                      alt={author}
                      className="size-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-brand font-heading text-sm font-bold text-white"
                    >
                      {(author || "C").charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-heading font-semibold text-foreground">
                      {author || "Client"}
                    </p>
                    {role || company ? (
                      <p className="truncate text-sm text-muted-foreground">
                        {[role, company].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
                  </div>
                </figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>
    </Reveal>
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

        <div className="mt-10 grid gap-12  lg:gap-16">
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

            <ProjectReviews projectId={project.id} />
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

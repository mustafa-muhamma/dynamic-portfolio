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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { GradientOrbs, Reveal } from "@/components/public/motion";
import { Section, SectionHeading } from "@/components/public/section";
import { useProjects } from "@/hooks/use-public";
import type { Project } from "@/lib/content";
import { normalizeGalleryImages } from "@/lib/images";
import { cn } from "@/lib/utils";

const SLIDE_INTERVAL = 6000;

function projectHref(project: Project): string {
  const slug = project.slug?.trim();
  return slug ? `/projects/${encodeURIComponent(slug)}` : `/projects/${project.id}`;
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
  const images = normalizeGalleryImages(project.images);
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
        className="group relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-brand/10 lg:aspect-auto lg:h-full"
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
      className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:h-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Link href={href} className="absolute inset-0 z-10">
        <AnimatePresence initial={false}>
          <motion.img
            key={index}
            src={images[index].url}
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

function ProjectSlide({ item }: { item: Project }) {
  const href = projectHref(item);
  const date = formatMonth(item.date);

  return (
    <article className="grid overflow-hidden rounded-3xl border border-border bg-background/60 backdrop-blur transition-colors hover:border-brand-1 lg:grid-cols-[1.05fr_0.95fr]">
      <ProjectCover project={item} href={href} />

      <div className="flex flex-col p-7 md:p-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
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

        <Link href={href} className="mt-3 inline-block">
          <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand-1 md:text-3xl">
            {item.title}
          </h3>
        </Link>

        {item.description ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
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

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
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
        {item.link ? (
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Live link may be broken — view the case study for screenshots and testimonials.
          </p>
        ) : null}
      </div>
    </article>
  );
}

const slideVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 56, scale: 0.985 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -56, scale: 0.985 })
};

export function Projects() {
  const { data: projects } = useProjects();

  const items = useMemo(
    () =>
      projects
        ? [...projects]
            .sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
            .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
        : [],
    [projects]
  );

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const activeRef = useRef(0);
  const touchX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      const count = items.length;
      if (count <= 1) return;
      const next = ((index % count) + count) % count;
      if (next === activeRef.current) return;
      setDirection(next > activeRef.current ? 1 : -1);
      activeRef.current = next;
      setActive(next);
    },
    [items.length]
  );

  useEffect(() => {
    if (items.length <= 1 || paused) return;
    const id = setInterval(() => goTo(activeRef.current + 1), SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [items.length, paused, goTo]);

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

        <Reveal>
          <div
            className="relative select-none"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchX.current == null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 48) goTo(activeRef.current + (dx < 0 ? 1 : -1));
              touchX.current = null;
            }}
          >
            <AnimatePresence initial={false} mode="popLayout" custom={direction}>
              <motion.div
                key={items[active].id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectSlide item={items[active]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        {items.length > 1 ? (
          <Reveal delay={0.1} className="mt-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous project"
                onClick={() => goTo(activeRef.current - 1)}
                className="flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand-2 hover:text-brand-2"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span className="hidden font-mono text-xs text-muted-foreground sm:block">
                {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to project ${index + 1}`}
                  onClick={() => goTo(index)}
                  className={cn(
                    "size-2 rounded-full transition-all",
                    index === active
                      ? "w-7 bg-brand-2"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next project"
              onClick={() => goTo(activeRef.current + 1)}
              className="flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand-2 hover:text-brand-2"
            >
              <ChevronRight className="size-5" />
            </button>
          </Reveal>
        ) : null}
      </div>
    </Section>
  );
}

"use client";

import { ChevronLeft, ChevronRight, ExternalLink, Quote, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { GradientOrbs, Reveal } from "@/components/public/motion";
import { Section, SectionHeading } from "@/components/public/section";
import { useProjects, useTestimonials } from "@/hooks/use-public";
import type { Project, Testimonial } from "@/lib/content";
import { normalizeGalleryImages } from "@/lib/images";
import { cn } from "@/lib/utils";

const GAP = 24;

function projectHref(project: Project): string {
  const slug = project.slug?.trim();
  return slug ? `/projects/${encodeURIComponent(slug)}` : `/projects/${project.id}`;
}

function TestimonialCard({
  item,
  project,
  className
}: {
  item: Testimonial;
  project?: Project;
  className?: string;
}) {
  const screenshots = normalizeGalleryImages(item.images);
  const author = item.author?.trim() || "";
  const role = item.role?.trim() || "";
  const company = item.company?.trim() || "";
  const quote = item.quote?.trim() || "";
  const hasIdentity = Boolean(author || item.avatar || role || company);

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-3xl border border-border bg-background/60 p-7 backdrop-blur transition-colors hover:border-brand-1",
        className
      )}
    >
      {quote ? (
        <>
          <Quote aria-hidden="true" className="absolute top-6 right-6 size-8 text-brand-1/20" />

          {project ? (
            <Link
              href={projectHref(project)}
              className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-2/40 bg-brand-2/10 px-3 py-1 text-xs font-semibold text-brand-2 transition-colors hover:bg-brand-2/20"
            >
              <Sparkles className="size-3" />
              {project.title}
              <ExternalLink className="size-3" />
            </Link>
          ) : null}

          <blockquote className="text-base leading-relaxed text-foreground">
            &ldquo;{quote}&rdquo;
          </blockquote>
        </>
      ) : null}

      {screenshots.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {screenshots.slice(0, 3).map((src, index) => (
            <div key={index} className="overflow-hidden rounded-lg border border-border">
              <img
                src={src.url}
                alt={`Proof screenshot ${index + 1}`}
                className="aspect-video w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}

      {hasIdentity ? (
        <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
          {item.avatar ? (
            <img
              src={item.avatar}
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
            <p className="font-heading font-semibold text-foreground">{author || "Client"}</p>
            {role || company ? (
              <p className="truncate text-sm text-muted-foreground">
                {[role, company].filter(Boolean).join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function Testimonials() {
  const { data: testimonials } = useTestimonials();
  const { data: projects } = useProjects();

  const items = useMemo(
    () => (testimonials ? [...testimonials].sort((a, b) => (b.order ?? 0) - (a.order ?? 0)) : []),
    [testimonials]
  );

  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    for (const project of projects ?? []) map.set(project.id, project);
    return map;
  }, [projects]);

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const getStep = useCallback((): number => {
    const first = trackRef.current?.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + GAP : 0;
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = trackRef.current;
      if (!el) return;
      const step = getStep();
      if (step === 0) return;
      const next = Math.min(items.length - 1, Math.max(0, index));
      el.scrollTo({ left: next * step, behavior: "smooth" });
    },
    [getStep, items.length]
  );

  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const step = getStep();
    if (step === 0) return;
    setActive(Math.round(el.scrollLeft / step));
  }, [getStep]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length <= 1 || paused) return;
    const id = setInterval(() => {
      const step = getStep();
      if (step === 0) return;
      const current = Math.round(el.scrollLeft / step);
      const next = current + 1 >= items.length ? 0 : current + 1;
      el.scrollTo({ left: next * step, behavior: "smooth" });
    }, 5200);
    return () => clearInterval(id);
  }, [items.length, paused, getStep]);

  if (items.length === 0) return null;

  return (
    <Section id="testimonials" className="relative py-24 md:py-32">
      <GradientOrbs className="opacity-30 dark:opacity-50" />

      <div className="relative">
        <SectionHeading
          eyebrow="Testimonials"
          title="What people say"
          description="Feedback from people I have worked with, linked to the work it is about."
        />

        <Reveal>
          <div
            ref={trackRef}
            onScroll={handleScroll}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="w-[86%] shrink-0 snap-start sm:w-[62%] lg:w-[44%] xl:w-[34%]"
              >
                <TestimonialCard item={item} project={projectMap.get(item.projectId ?? "")} />
              </div>
            ))}
          </div>
        </Reveal>

        {items.length > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => scrollToIndex(active - 1)}
              className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand-2 hover:text-brand-2"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex items-center gap-2">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to testimonial ${index + 1}`}
                  onClick={() => scrollToIndex(index)}
                  className={cn(
                    "size-2 rounded-full transition-all",
                    index === active
                      ? "w-6 bg-brand-2"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => scrollToIndex(active + 1)}
              className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand-2 hover:text-brand-2"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        ) : null}
      </div>
    </Section>
  );
}

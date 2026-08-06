"use client";

import { Quote } from "lucide-react";

import { GradientOrbs, Marquee, Stagger, StaggerItem } from "@/components/public/motion";
import { Section, SectionHeading } from "@/components/public/section";
import { useTestimonials } from "@/hooks/use-public";

export function Testimonials() {
  const { data: testimonials } = useTestimonials();

  const items = testimonials
    ? [...testimonials].sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
    : [];

  if (items.length === 0) return null;

  return (
    <Section id="testimonials" className="relative py-24 md:py-32">
      <GradientOrbs className="opacity-30 dark:opacity-50" />

      <div className="relative">
        <SectionHeading
          eyebrow="Testimonials"
          title="What people say"
          description="Feedback from people I have worked with on real projects."
        />

        <Stagger className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <StaggerItem
              key={item.id}
              className="relative flex flex-col rounded-3xl border border-border bg-background/60 p-7 backdrop-blur transition-colors hover:border-brand-1"
            >
              <Quote aria-hidden="true" className="absolute top-6 right-6 size-8 text-brand-1/20" />

              <blockquote className="text-base leading-relaxed text-foreground">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="size-11 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-brand font-heading text-sm font-bold text-white"
                  >
                    {item.author.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="font-heading font-semibold text-foreground">{item.author}</p>
                  {item.role || item.company ? (
                    <p className="truncate text-sm text-muted-foreground">
                      {[item.role, item.company].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Marquee className="mt-12 border-y border-border py-4" duration={44} reverse pauseOnHover>
          {items.map((item) => (
            <span
              key={item.id}
              className="mx-4 whitespace-nowrap text-sm italic text-muted-foreground"
            >
              &ldquo;{item.quote.slice(0, 90)}
              {item.quote.length > 90 ? "…" : ""}&rdquo; — {item.author}
            </span>
          ))}
        </Marquee>
      </div>
    </Section>
  );
}

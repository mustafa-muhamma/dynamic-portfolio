"use client";

import { type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/public/motion";

export function Section({
  id,
  className,
  children
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24", className)}>
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mb-12 flex flex-col gap-4 md:mb-16",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-brand-1">{eyebrow}</span>
      ) : null}
      <h2 className="font-heading text-balance text-3xl font-bold tracking-tight md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "text-balance text-muted-foreground md:text-lg",
            align === "center" ? "max-w-2xl" : "max-w-xl"
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

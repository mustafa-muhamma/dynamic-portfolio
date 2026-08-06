"use client";

import { ArrowUpRight, Calendar, MapPin } from "lucide-react";

import { GradientOrbs, Stagger, StaggerItem } from "@/components/public/motion";
import { Section, SectionHeading } from "@/components/public/section";
import { useExperience } from "@/hooks/use-public";

function formatDate(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
}

function formatRange(start?: string, end?: string, current?: boolean): string {
  const from = formatDate(start);
  const to = current ? "Present" : formatDate(end);
  if (from && to) return `${from} — ${to}`;
  if (from) return from;
  return to || "";
}

function formatDuration(start?: string, end?: string, current?: boolean): string {
  if (!start) return "";
  const from = new Date(start);
  if (Number.isNaN(from.getTime())) return "";
  const to = current ? new Date() : end ? new Date(end) : undefined;
  if (!to || Number.isNaN(to.getTime())) return "";

  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) months -= 1;
  if (months < 1) months = 1;

  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years > 0 && rem > 0) return `${years}y ${rem}mo`;
  if (years > 0) return `${years}y`;
  return `${rem}mo`;
}

export function Experience() {
  const { data: experience } = useExperience();

  const items = experience
    ? [...experience]
        .sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
        .sort(
          (a, b) =>
            (b.start ? new Date(b.start).getTime() : 0) -
            (a.start ? new Date(a.start).getTime() : 0)
        )
    : [];

  if (items.length === 0) return null;

  return (
    <Section id="experience" className="relative py-24 md:py-32">
      <GradientOrbs className="opacity-30 dark:opacity-50" />

      <div className="relative">
        <SectionHeading
          eyebrow="Experience"
          title="Professional experience"
          description="A summary of the roles I have taken on and the work I have delivered along the way."
        />

        <div className="relative mx-auto max-w-3xl">
          <div
            aria-hidden="true"
            className="absolute bottom-2 top-2 left-[7px] w-px bg-gradient-to-b from-brand-1 via-border to-transparent"
          />

          <Stagger className="space-y-12">
            {items.map((item) => {
              const range = formatRange(item.start, item.end, item.current);
              const duration = formatDuration(item.start, item.end, item.current);
              return (
                <StaggerItem key={item.id} className="relative pl-10">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1.5 size-3.5 rounded-full border-2 border-brand-2 bg-background shadow-[0_0_12px] shadow-brand-2/40"
                  />

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                      {item.role}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-base font-medium text-brand-2">
                      {item.company}
                    </span>
                    {item.current ? (
                      <span className="rounded-full border border-brand-2/40 bg-brand-2/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-2">
                        Current
                      </span>
                    ) : null}
                    {duration ? (
                      <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 font-mono text-xs font-medium text-muted-foreground">
                        {duration}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {range ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {range}
                      </span>
                    ) : null}
                    {item.location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {item.location}
                      </span>
                    ) : null}
                  </div>

                  {item.summary ? (
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                      {item.summary}
                    </p>
                  ) : null}

                  {item.bullets && item.bullets.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                      {item.bullets.map((bullet, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                        >
                          <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-brand-2" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}

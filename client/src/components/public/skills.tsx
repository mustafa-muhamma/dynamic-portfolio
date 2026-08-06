"use client";

import { GradientOrbs, Marquee, Reveal, Stagger, StaggerItem } from "@/components/public/motion";
import { Section, SectionHeading } from "@/components/public/section";
import { useSkills } from "@/hooks/use-public";

export function Skills() {
  const { data: skills } = useSkills();

  const items = skills ? [...skills].sort((a, b) => (b.order ?? 0) - (a.order ?? 0)) : [];

  if (items.length === 0) return null;

  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const key = item.category?.trim() || "Skills";
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }

  return (
    <Section id="skills" className="relative py-24 md:py-32">
      <GradientOrbs className="opacity-25 dark:opacity-40" />

      <div className="relative">
        <SectionHeading
          eyebrow="Skills"
          title="Skills & expertise"
          description="The technologies and disciplines I reach for every day, grouped by area."
        />

        <Reveal>
          <Marquee className="border-y border-border py-4" duration={32} pauseOnHover>
            {items.map((item) => (
              <span
                key={item.id}
                className="mx-3 flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium text-muted-foreground"
              >
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-2" />
                {item.name}
              </span>
            ))}
          </Marquee>
        </Reveal>

        <div className="mt-14 space-y-12">
          {[...groups.entries()].map(([category, list]) => (
            <div key={category}>
              <Reveal className="mb-4 flex items-center gap-3">
                <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-brand-1">
                  {category}
                </h3>
                <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              </Reveal>

              <Stagger className="flex flex-wrap gap-2">
                {list.map((item) => (
                  <StaggerItem
                    key={item.id}
                    className="rounded-lg border border-border bg-background/60 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-brand-1 hover:text-brand-2"
                  >
                    {item.name}
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

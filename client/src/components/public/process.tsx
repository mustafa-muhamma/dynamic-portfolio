"use client";

import { GradientOrbs, Stagger, StaggerItem } from "@/components/public/motion";
import { Section, SectionHeading } from "@/components/public/section";
import { useProcess } from "@/hooks/use-public";

export function Process() {
  const { data: process } = useProcess();

  const items = process ? [...process].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : [];

  if (items.length === 0) return null;

  return (
    <Section id="process" className="relative py-24 md:py-32">
      <GradientOrbs className="opacity-25 dark:opacity-40" />

      <div className="relative">
        <SectionHeading
          eyebrow="Process"
          title="How we'll work together"
          description="A clear, predictable way of working from first call to final delivery."
        />

        <Stagger className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div
            aria-hidden="true"
            className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-px bg-gradient-to-r from-brand-1 via-border to-brand-2 lg:block"
          />

          {items.map((item, index) => {
            const number = item.step ?? index + 1;
            return (
              <StaggerItem key={item.id} className="relative">
                <div className="relative z-10 flex size-12 items-center justify-center rounded-2xl border border-brand-2/40 bg-background font-heading text-lg font-bold text-brand-2 shadow-[0_0_20px] shadow-brand-2/20">
                  {String(number).padStart(2, "0")}
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                {item.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}

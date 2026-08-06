"use client";

import { Check, Sparkles } from "lucide-react";

import { GradientOrbs, SpotlightCard, Stagger, StaggerItem } from "@/components/public/motion";
import { Section, SectionHeading } from "@/components/public/section";
import { useServices } from "@/hooks/use-public";

function formatPrice(price?: number): string {
  if (typeof price !== "number" || Number.isNaN(price)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);
}

export function Services() {
  const { data: services } = useServices();

  const items = services ? [...services].sort((a, b) => (b.order ?? 0) - (a.order ?? 0)) : [];

  if (items.length === 0) return null;

  return (
    <Section id="services" className="relative py-24 md:py-32">
      <GradientOrbs className="opacity-30 dark:opacity-50" />

      <div className="relative">
        <SectionHeading
          eyebrow="Services"
          title="What I can build for you"
          description="Focused engagements, delivered end to end, with a clear scope and a finished product."
        />

        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <StaggerItem key={item.id}>
              <SpotlightCard className="h-full rounded-3xl border border-border bg-background/60 backdrop-blur transition-colors hover:border-brand-1">
                <div className="flex h-full flex-col p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-brand-2">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-full border border-brand-2/30 bg-brand-2/10 p-1.5 text-brand-2">
                      <Sparkles className="size-4" />
                    </span>
                  </div>

                  <h3 className="mt-5 font-heading text-xl font-semibold tracking-tight text-foreground">
                    {item.name}
                  </h3>

                  {item.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}

                  {item.deliverables && item.deliverables.length > 0 ? (
                    <ul className="mt-5 space-y-2">
                      {item.deliverables.map((deliverable) => (
                        <li
                          key={deliverable}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="mt-0.5 size-4 shrink-0 text-brand-2" />
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {typeof item.price === "number" ? (
                    <div className="mt-6 border-t border-border pt-4">
                      <p className="font-heading text-2xl font-bold text-gradient-brand">
                        {formatPrice(item.price)}
                      </p>
                      <p className="mt-0.5 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        starting price
                      </p>
                    </div>
                  ) : null}
                </div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

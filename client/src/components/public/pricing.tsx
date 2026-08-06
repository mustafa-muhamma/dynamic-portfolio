"use client";

import { Check, Sparkles } from "lucide-react";

import { GradientOrbs, Stagger, StaggerItem } from "@/components/public/motion";
import { Section, SectionHeading } from "@/components/public/section";
import { usePricing } from "@/hooks/use-public";

function formatPrice(price?: number): string {
  if (typeof price !== "number" || Number.isNaN(price)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);
}

export function Pricing() {
  const { data: pricing } = usePricing();

  const items = pricing ? [...pricing].sort((a, b) => (b.order ?? 0) - (a.order ?? 0)) : [];

  if (items.length === 0) return null;

  const popularIndex = Math.floor(items.length / 2);

  return (
    <Section id="pricing" className="relative py-24 md:py-32">
      <GradientOrbs className="opacity-30 dark:opacity-50" />

      <div className="relative">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          description="No hidden fees and no surprises — pick a plan that fits your project and we go from there."
        />

        <Stagger className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {items.map((item, index) => {
            const popular = index === popularIndex;
            return (
              <StaggerItem
                key={item.id}
                className={`relative flex flex-col rounded-3xl border p-7 backdrop-blur transition-colors ${
                  popular
                    ? "border-brand-1 bg-brand-1/5 shadow-[0_0_40px] shadow-brand-1/10"
                    : "border-border bg-background/60 hover:border-brand-1"
                }`}
              >
                {popular ? (
                  <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-1 text-xs font-semibold text-white">
                    <Sparkles className="size-3.5" />
                    Most popular
                  </span>
                ) : null}

                <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                  {item.tier}
                </h3>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-bold text-gradient-brand">
                    {formatPrice(item.price)}
                  </span>
                  {item.period ? (
                    <span className="text-sm text-muted-foreground">/{item.period}</span>
                  ) : null}
                </div>

                {item.features && item.features.length > 0 ? (
                  <ul className="mt-6 space-y-2.5">
                    {item.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-brand-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <a
                  href="#contact"
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                    popular
                      ? "btn-gradient text-white"
                      : "border border-border text-foreground hover:border-brand-2 hover:text-brand-2"
                  }`}
                >
                  Get started
                </a>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}

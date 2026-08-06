"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Fragment, useMemo, useRef } from "react";

import { GradientOrbs, Magnetic, TiltCard } from "@/components/public/motion";
import { SocialIcon } from "@/components/public/social-icon";
import {
  useHero,
  useProfile,
  useProjects,
  useSkills,
  useSocialLinks,
  useTestimonials
} from "@/hooks/use-public";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function CtaHref(url?: string): { href: string; external: boolean } {
  const target = url?.trim() || "";
  const external = /^(https?:)?\/\//i.test(target) || target.startsWith("mailto:");
  return { href: external ? target : target || "#contact", external };
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 36]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0.35]);

  const { data: hero } = useHero();
  const { data: profile } = useProfile();
  const { data: socials } = useSocialLinks();
  const { data: projects } = useProjects();
  const { data: skills } = useSkills();
  const { data: testimonials } = useTestimonials();

  const heading = hero?.heading?.trim() || profile?.name || "Portfolio";
  const words = heading.split(/\s+/);
  const subheading = hero?.subheading || profile?.title || "";
  const photo = hero?.image || profile?.photo || "";
  const primary = CtaHref(hero?.primaryCtaUrl);
  const secondary = CtaHref(hero?.secondaryCtaUrl);
  const hasPrimary = Boolean(hero?.primaryCtaLabel?.trim() && hero?.primaryCtaUrl?.trim());
  const hasSecondary = Boolean(hero?.secondaryCtaLabel?.trim() && hero?.secondaryCtaUrl?.trim());

  const yearsExperience =
    typeof profile?.yearsExperience === "number" ? profile.yearsExperience : null;

  const stats = useMemo(
    () =>
      [
        { value: projects?.length, label: "Projects" },
        { value: yearsExperience, label: "Years Experience" },
        { value: skills?.length, label: "Skills" },
        { value: testimonials?.length, label: "Testimonials" }
      ].filter((stat) => typeof stat.value === "number" && stat.value > 0),
    [projects, yearsExperience, skills, testimonials]
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-28 md:px-8"
    >
      <div className="site-grid absolute inset-0 [mask-image:radial-gradient(ellipse_65%_60%_at_50%_40%,black,transparent)]" />
      <GradientOrbs className="opacity-90" />

      {hero?.backgroundImage ? (
        <img
          src={hero.backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
      ) : null}

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-16 md:grid-cols-[1fr_1fr] md:items-center md:gap-16 lg:gap-24">
        <motion.div
          style={{ y: textY, opacity: fade }}
          className="flex flex-col items-center text-center md:items-start md:text-left"
        >
          {hero?.eyebrow?.trim() ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="glass-card mb-8 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-muted-foreground"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {hero.eyebrow}
            </motion.div>
          ) : null}

          <h1 className="font-heading text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            {words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <span className="inline-block overflow-hidden pb-1 align-top">
                  <motion.span
                    className="inline-block text-gradient-animated"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.07, ease: EASE }}
                  >
                    {word}
                  </motion.span>
                </span>{" "}
              </Fragment>
            ))}
          </h1>

          {subheading ? (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
              className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              {subheading}
            </motion.p>
          ) : null}

          {(hasPrimary || hasSecondary) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4 md:justify-start"
            >
              {hasPrimary ? (
                <Magnetic>
                  <Link
                    href={primary.href}
                    target={primary.external ? "_blank" : undefined}
                    rel={primary.external ? "noreferrer" : undefined}
                    className="bg-gradient-brand group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-1/20 transition-shadow hover:shadow-brand-1/40"
                  >
                    {hero?.primaryCtaLabel}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Magnetic>
              ) : null}
              {hasSecondary ? (
                <Magnetic>
                  <Link
                    href={secondary.href}
                    target={secondary.external ? "_blank" : undefined}
                    rel={secondary.external ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-brand-1"
                  >
                    {hero?.secondaryCtaLabel}
                  </Link>
                </Magnetic>
              ) : null}
            </motion.div>
          )}

          {stats.length > 0 ? (
            <motion.dl
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
              className="mt-12 grid w-full max-w-md grid-cols-4 gap-x-4 gap-y-6 border-t border-border pt-8"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1.5">
                  <dd className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                    {stat.value}
                  </dd>
                  <dt className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </motion.dl>
          ) : null}

          {socials && socials.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              className="mt-10 flex items-center gap-3"
            >
              <span className="hidden h-px w-10 bg-gradient-to-r from-brand-1 to-transparent md:block" />
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.platform}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-brand-1 hover:text-foreground"
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </motion.div>
          ) : null}
        </motion.div>

        {photo ? (
          <motion.div
            style={{ y: portraitY, opacity: fade }}
            className="relative mx-auto flex w-full max-w-sm items-center justify-center md:max-w-md"
          >
            <div className="absolute -inset-20 rounded-full bg-gradient-brand opacity-20 blur-3xl animate-pulse-glow" />
            <div className="absolute -inset-10 rounded-full bg-gradient-brand opacity-10 blur-2xl" />

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              className="relative"
            >
              <div
                className="absolute inset-4 rounded-full border border-border/60"
                aria-hidden="true"
              />
              <div
                className="absolute inset-8 rounded-full border border-border/30"
                aria-hidden="true"
              />

              <TiltCard maxTilt={10} className="relative">
                <div className="relative overflow-hidden rounded-full bg-gradient-brand p-[2px]">
                  <div className="overflow-hidden rounded-full">
                    <img
                      src={photo}
                      alt={profile?.name ?? "Portrait"}
                      className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-background/45 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                </div>
              </TiltCard>

              {profile?.title ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1, ease: EASE }}
                  className="glass-card absolute -bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold text-foreground md:text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
                  {profile.title}
                </motion.div>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-border p-1.5">
          <span className="h-2 w-1 animate-scroll-dot rounded-full bg-brand-1" />
        </span>
        <ArrowDown className="h-4 w-4 animate-float" />
      </motion.a>
    </section>
  );
}

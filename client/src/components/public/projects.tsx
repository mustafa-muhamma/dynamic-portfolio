"use client";

import { ArrowUpRight, Folder, GitFork } from "lucide-react";

import { GradientOrbs, Stagger, StaggerItem } from "@/components/public/motion";
import { Section, SectionHeading } from "@/components/public/section";
import { useProjects } from "@/hooks/use-public";

export function Projects() {
  const { data: projects } = useProjects();

  const items = projects
    ? [...projects]
        .sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
        .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
    : [];

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

        <Stagger className="grid gap-6 lg:grid-cols-2">
          {items.map((item) => {
            const [cover] = item.images ?? [];
            return (
              <StaggerItem
                key={item.id}
                className="group overflow-hidden rounded-3xl border border-border bg-background/60 backdrop-blur transition-colors hover:border-brand-1"
              >
                {cover ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={cover}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"
                    />
                  </div>
                ) : (
                  <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-brand/10">
                    <div
                      aria-hidden="true"
                      className="absolute -inset-10 rounded-full bg-gradient-brand/20 blur-3xl"
                    />
                    <Folder className="relative size-12 text-brand-2 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                )}

                <div className="p-6 md:p-7">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    {item.featured ? (
                      <span className="rounded-full border border-brand-1/40 bg-brand-1/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-1">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  {item.role ? (
                    <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-brand-2">
                      {item.role}
                    </p>
                  ) : null}

                  {item.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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

                  {item.link || item.repo ? (
                    <div className="mt-6 flex flex-wrap gap-3">
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
                    </div>
                  ) : null}
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}

"use client";

import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Reveal } from "@/components/public/motion";
import { SocialIcon } from "@/components/public/social-icon";
import { getNavItems } from "@/lib/sections";
import { useProfile, useSiteSettings, useSocialLinks } from "@/hooks/use-public";
import { cn } from "@/lib/utils";

export function Footer() {
  const { data: profile } = useProfile();
  const { data: siteSettings } = useSiteSettings();
  const { data: socials } = useSocialLinks();

  const navItems = useMemo(
    () => getNavItems(siteSettings?.navigationLabels),
    [siteSettings?.navigationLabels]
  );

  const name = profile?.name ?? siteSettings?.siteName ?? "";
  const tagline = profile?.tagline ?? siteSettings?.tagline ?? "";

  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 md:px-8 md:py-16">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-heading text-xl font-bold tracking-tight">
              <span className="text-gradient">{name}</span>
            </p>
            {tagline ? <p className="mt-1 text-sm text-muted-foreground">{tagline}</p> : null}
          </div>
          {socials && socials.length > 0 ? (
            <div className="flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.platform}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-brand-1 hover:text-foreground"
                >
                  <SocialIcon
                    platform={social.platform}
                    icon={social.icon}
                    iconUrl={social.iconUrl}
                  />
                </a>
              ))}
            </div>
          ) : null}
        </Reveal>

        <Reveal
          delay={0.1}
          className="flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row md:items-center"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()}</span>
            <a
              href="#top"
              aria-label="Back to top"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border border-border",
                "text-muted-foreground transition-all hover:border-brand-1 hover:text-foreground"
              )}
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

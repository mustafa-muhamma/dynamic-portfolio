"use client";

import { Check, Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

import { GradientOrbs, Reveal, Stagger, StaggerItem } from "@/components/public/motion";
import { Section, SectionHeading } from "@/components/public/section";
import { SocialIcon } from "@/components/public/social-icon";
import { useContactSettings, useSocialLinks } from "@/hooks/use-public";
import { submitInquiry } from "@/lib/public-api";

type FormState = "idle" | "submitting" | "sent" | "error";

export function Contact() {
  const { data: settings } = useContactSettings();
  const { data: socials } = useSocialLinks();

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  const email = settings?.email?.trim() || "";
  const phone = settings?.phone?.trim() || "";
  const location = settings?.location?.trim() || "";
  const availability = settings?.availability?.trim() || "";

  const contactItems = [
    { icon: Mail, label: "Email", value: email, href: email ? `mailto:${email}` : undefined },
    { icon: Phone, label: "Phone", value: phone, href: phone ? `tel:${phone}` : undefined },
    { icon: MapPin, label: "Location", value: location },
    { icon: Clock, label: "Availability", value: availability }
  ].filter((item) => item.value);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError("");
    try {
      await submitInquiry(form);
      setState("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <Section id="contact" className="relative py-24 md:py-32">
      <GradientOrbs className="opacity-40 dark:opacity-60" />

      <div className="relative">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something together"
          description="Tell me about your project — I will get back to you within a day."
        />

        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {contactItems.map((item) => (
                <StaggerItem
                  key={item.label}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-background/60 p-4 backdrop-blur"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-2/10 text-brand-2">
                    <item.icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="block truncate text-sm font-semibold text-foreground transition-colors hover:text-brand-2"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="truncate text-sm font-semibold text-foreground">{item.value}</p>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            {socials && socials.length > 0 ? (
              <Reveal className="mt-6 flex flex-wrap gap-3">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.platform}
                    className="flex size-11 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-brand-2 hover:text-brand-2"
                  >
                    <SocialIcon
                      platform={social.platform}
                      icon={social.icon}
                      iconUrl={social.iconUrl}
                      className="size-5"
                    />
                  </a>
                ))}
              </Reveal>
            ) : null}
          </div>

          {settings?.formEnabled !== false ? (
            <Reveal className="rounded-3xl border border-border bg-background/60 p-7 backdrop-blur md:p-9">
              {state === "sent" ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <span className="flex size-16 items-center justify-center rounded-full bg-brand-2/10 text-brand-2">
                    <Check className="size-8" />
                  </span>
                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    Message sent
                  </h3>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Thanks for reaching out. I will reply to {form.email || "your email"} shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        Name
                      </span>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand-1"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        Email
                      </span>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand-1"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      Message
                    </span>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell me about your project…"
                      className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand-1"
                    />
                  </label>

                  {state === "error" ? <p className="text-sm text-destructive">{error}</p> : null}

                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    className="btn-gradient inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                  >
                    {state === "submitting" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Send message
                      </>
                    )}
                  </button>
                </form>
              )}
            </Reveal>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

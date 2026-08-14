"use client";

import { SingletonManager } from "@/components/admin/singleton-manager";
import { HeroForm } from "@/components/admin/forms";

export default function HeroPage() {
  return (
    <SingletonManager
      resource="hero"
      title="Hero"
      description="Headline, intro, call-to-action buttons, and background"
      Form={HeroForm}
      getImages={(doc) => [doc.image, doc.backgroundImage].filter((u): u is string => Boolean(u))}
    />
  );
}

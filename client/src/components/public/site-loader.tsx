"use client";

import { useEffect, useState } from "react";

import { Preloader } from "@/components/public/preloader";
import { useProfile } from "@/hooks/use-public";

export function SiteLoader() {
  const { data: profile } = useProfile();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setDone(true), 1600);
    return () => clearTimeout(timeout);
  }, []);

  return <Preloader name={profile?.name} done={done} />;
}

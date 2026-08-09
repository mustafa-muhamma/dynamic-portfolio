"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { useInquiries } from "@/hooks/use-content";

const STORAGE_KEY = "inquiries:seen";

function loadSeen(): Set<string> {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveSeen(ids: Set<string>): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // session storage unavailable (e.g. private mode) — alert once per mount
  }
}

export function InquiryAlert() {
  const router = useRouter();
  const list = useInquiries();
  const seenRef = useRef<Set<string> | null>(null);
  if (seenRef.current === null) {
    seenRef.current = loadSeen();
  }

  useEffect(() => {
    if (!seenRef.current) return;
    const current = list.data ?? [];
    for (const inquiry of current) {
      if (inquiry.read || seenRef.current.has(inquiry.id)) continue;
      seenRef.current.add(inquiry.id);
      const preview = `${inquiry.message.slice(0, 80)}${inquiry.message.length > 80 ? "\u2026" : ""}`;
      toast("New inquiry", {
        description: `${inquiry.name} — ${preview}`,
        action: {
          label: "View",
          onClick: () => router.push("/admin/inquiries")
        }
      });
    }
    saveSeen(seenRef.current);
  }, [list.data, router]);

  return null;
}

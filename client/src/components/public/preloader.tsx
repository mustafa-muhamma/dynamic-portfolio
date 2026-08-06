"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export function Preloader({ name, done }: { name?: string; done: boolean }) {
  const chars = (name ?? "").trim().split("");
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background",
        done && "pointer-events-none"
      )}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-14 items-center overflow-hidden">
          {chars.length > 0 ? (
            chars.map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.35 + i * 0.05,
                  duration: 0.6,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                className="font-heading text-3xl font-bold tracking-tight md:text-4xl"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))
          ) : (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-brand-1"
            />
          )}
        </div>
        <div className="h-px w-40 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="h-full w-1/2 bg-gradient-brand"
          />
        </div>
      </div>
    </motion.div>
  );
}

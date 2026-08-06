"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
  type Variants
} from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type Ease = [number, number, number, number];

const EASE: Ease = [0.21, 0.47, 0.32, 0.98];

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
} & HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
} & Omit<HTMLMotionProps<"div">, "variants">) {
  const variants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay }
    }
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-90px" }}
      variants={variants}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 22,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  y?: number;
} & Omit<HTMLMotionProps<"div">, "variants">) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE }
    }
  };
  return (
    <motion.div variants={variants} className={className} {...rest}>
      {children}
    </motion.div>
  );
}

export function Magnetic({
  children,
  className,
  strength = 0.3,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
} & Omit<HTMLMotionProps<"div">, "style">) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Marquee({
  children,
  className,
  duration = 36,
  reverse = false,
  pauseOnHover = true
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
}) {
  return (
    <div className={cn("group overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal"
          } as CSSProperties
        }
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

export function SpotlightCard({
  children,
  className,
  radius = 360
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
}) {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const springX = useSpring(x, { stiffness: 280, damping: 28 });
  const springY = useSpring(y, { stiffness: 280, damping: 28 });
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${springX}px ${springY}px, var(--glow-1), transparent 70%)`;

  return (
    <motion.div
      className={cn("group relative overflow-hidden", className)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
      onMouseLeave={() => {
        x.set(-500);
        y.set(-500);
      }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export function TiltCard({
  children,
  className,
  maxTilt = 14,
  glare = true
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 18, mass: 0.4 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 18, mass: 0.4 });
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.16), transparent 60%)`;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateX.set((0.5 - py) * maxTilt);
    rotateY.set((px - 0.5) * maxTilt);
    glowX.set(px * 100);
    glowY.set(py * 100);
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: "preserve-3d",
        perspective: 1200
      }}
      className={cn("group relative", className)}
    >
      {children}
      {glare ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBackground }}
        />
      ) : null}
    </motion.div>
  );
}

export function GradientOrbs({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <div className="absolute -top-40 -left-32 h-[32rem] w-[32rem] animate-aurora rounded-full bg-[radial-gradient(circle_at_center,var(--glow-1),transparent_65%)] blur-2xl" />
      <div
        className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] animate-aurora rounded-full bg-[radial-gradient(circle_at_center,var(--glow-2),transparent_65%)] blur-2xl"
        style={{ animationDelay: "-5s" }}
      />
      <div
        className="absolute -bottom-48 left-1/3 h-[34rem] w-[34rem] animate-aurora rounded-full bg-[radial-gradient(circle_at_center,var(--glow-3),transparent_65%)] blur-2xl"
        style={{ animationDelay: "-10s" }}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Variant = "up" | "fade" | "zoom" | "left" | "right";

const variantClass: Record<Variant, string> = {
  up: "",
  fade: "reveal-fade",
  zoom: "reveal-zoom",
  left: "reveal-left",
  right: "reveal-right",
};

export default function Reveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback: if IntersectionObserver is unavailable, just show content.
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(raf);
    }

    // Reveal immediately if already within (most of) the viewport at mount —
    // deterministic, and doesn't depend on the observer's initial callback.
    let raf = 0;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      raf = requestAnimationFrame(() => setInView(true));
      if (once) return () => cancelAnimationFrame(raf);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) obs.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => { cancelAnimationFrame(raf); obs.disconnect(); };
  }, [once]);

  return (
    <div
      ref={ref}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
      className={`reveal ${variantClass[variant]} ${inView ? "in-view" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade" | "book" | "page";
};

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  variant = "fade",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.remove("sr-hidden-fade", "sr-hidden-book", "sr-hidden-page");
          el.classList.add("sr-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const hiddenClass =
    variant === "book"
      ? "sr-hidden-book"
      : variant === "page"
        ? "sr-hidden-page"
        : "sr-hidden-fade";

  return (
    <div ref={ref} className={`${hiddenClass} ${className}`}>
      {children}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/lib/i18n";
import type { NavigationItem } from "@/data/site";

type NavBarProps = {
  locale: Locale;
  companyName: string;
  partnerTagline: string;
  navigationItems: NavigationItem[];
  ctaLabel: string;
  languageLabel: string;
};

export function NavBar({
  locale,
  companyName,
  partnerTagline,
  navigationItems,
  ctaLabel,
  languageLabel,
}: NavBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/50 bg-[rgba(243,248,255,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8 lg:py-4">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 text-[var(--color-ink)]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0d2d62,#2e7ef7)] font-[family:var(--font-display)] text-xs font-bold tracking-[0.18em] text-white">
            TAKO
          </span>
          <span className="hidden sm:block">
            <span className="block font-[family:var(--font-display)] text-base font-semibold leading-tight tracking-tight">
              {companyName}
            </span>
            <span className="block text-[0.65rem] uppercase tracking-[0.22em] text-[var(--color-muted)]">
              {partnerTagline}
            </span>
          </span>
        </Link>

        {/* Desktop nav — pill buttons */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:bg-[rgba(13,78,166,0.08)] hover:text-[var(--color-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLocale={locale} label={languageLabel} />

          <Link
            href="/lien-he"
            className="hidden rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(13,45,98,0.2)] transition hover:bg-[var(--color-primary-strong)] sm:block"
          >
            {ctaLabel}
          </Link>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/80 text-[var(--color-ink)] transition hover:bg-white lg:hidden"
          >
            {open ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-[var(--color-line)] bg-white/95 px-4 pb-5 pt-3 backdrop-blur lg:hidden">
          <nav className="grid gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[rgba(13,78,166,0.06)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-[var(--color-line)] pt-4">
            <Link
              href="/lien-he"
              onClick={() => setOpen(false)}
              className="block w-full rounded-full bg-[var(--color-primary)] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

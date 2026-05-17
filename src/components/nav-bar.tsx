"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

function LogoMark() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="nbLg" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d2d62" />
          <stop offset="1" stopColor="#2e7ef7" />
        </linearGradient>
      </defs>
      <rect width="38" height="38" rx="11" fill="url(#nbLg)" />
      {/* T horizontal bar */}
      <rect x="9" y="10" width="20" height="4.5" rx="2.25" fill="white" />
      {/* T vertical bar */}
      <rect x="15.5" y="14.5" width="7" height="14.5" rx="3.5" fill="white" />
    </svg>
  );
}

export function NavBar({
  locale,
  companyName,
  partnerTagline,
  navigationItems,
  ctaLabel,
  languageLabel,
}: NavBarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const desktopLinkClass = (href: string) =>
    isActive(href)
      ? "rounded-full px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white shadow-[0_2px_10px_rgba(13,78,166,0.28)] transition"
      : "rounded-full px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[rgba(13,78,166,0.09)] hover:text-[var(--color-primary)]";

  const mobileLinkClass = (href: string) =>
    isActive(href)
      ? "flex rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-primary)] bg-[rgba(13,78,166,0.08)] border-l-[3px] border-[var(--color-primary)] transition"
      : "flex rounded-2xl px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[rgba(13,78,166,0.05)] hover:text-[var(--color-primary)]";

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-line)] bg-white/96 shadow-[0_1px_4px_rgba(0,0,0,0.07)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8 lg:py-3">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 text-[var(--color-ink)]"
        >
          <LogoMark />
          <span className="hidden sm:block">
            <span className="block font-[family:var(--font-display)] text-base font-semibold leading-tight tracking-tight">
              {companyName}
            </span>
            <span className="block text-[0.65rem] uppercase tracking-[0.22em] text-[var(--color-muted)]">
              {partnerTagline}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={desktopLinkClass(item.href)}
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
            className="hidden rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(13,45,98,0.22)] transition hover:bg-[var(--color-primary-strong)] sm:block"
          >
            {ctaLabel}
          </Link>

          {/* Hamburger mobile only */}
          <button
            type="button"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] bg-white text-[var(--color-ink)] transition hover:bg-[rgba(13,78,166,0.06)] lg:hidden"
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
        <div className="border-t border-[var(--color-line)] bg-white px-4 pb-5 pt-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] lg:hidden">
          <nav className="grid gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={mobileLinkClass(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-[var(--color-line)] pt-4">
            <Link
              href="/lien-he"
              onClick={() => setOpen(false)}
              className="block w-full rounded-full bg-[var(--color-primary)] px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_4px_14px_rgba(13,45,98,0.22)]"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

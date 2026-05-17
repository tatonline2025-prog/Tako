"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Locale } from "@/lib/i18n";

type LanguageSwitcherProps = {
  currentLocale: Locale;
  label: string;
};

const options: Array<{ locale: Locale; flag: string; text: string; label: string }> = [
  { locale: "vi", flag: "🇻🇳", text: "VI", label: "Tiếng Việt" },
  { locale: "en", flag: "🇺🇸", text: "EN", label: "English" },
];

export function LanguageSwitcher({
  currentLocale,
  label,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function setLocale(locale: Locale) {
    const redirectTo = typeof window === "undefined"
      ? pathname
      : `${window.location.pathname}${window.location.search}`;

    startTransition(async () => {
      await fetch("/api/preferences/locale", {
        body: JSON.stringify({ locale, redirectTo }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      router.refresh();
    });
  }

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-[var(--color-line)] bg-white/90 p-1 shadow-sm"
      aria-label={label}
      title={label}
    >
      {options.map((option) => {
        const isActive = option.locale === currentLocale;

        return (
          <button
            key={option.locale}
            type="button"
            onClick={() => setLocale(option.locale)}
            disabled={isPending || isActive}
            aria-pressed={isActive}
            aria-label={option.label}
            title={option.label}
            className={`inline-flex h-8 items-center justify-center gap-1 rounded-full px-2.5 text-xs font-semibold tracking-wide transition ${
              isActive
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-muted)] hover:bg-[rgba(13,78,166,0.08)] hover:text-[var(--color-ink)]"
            } disabled:cursor-default`}
          >
            <span className="text-base leading-none">{option.flag}</span>
          </button>
        );
      })}
    </div>
  );
}
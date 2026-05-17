"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const redirectTo = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  function setLocale(locale: Locale) {
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
    <div className="flex items-center gap-1 rounded-full border border-[var(--color-line)] bg-white/90 p-1 shadow-sm">
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
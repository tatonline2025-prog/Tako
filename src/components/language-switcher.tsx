"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { Locale } from "@/lib/i18n";

type LanguageSwitcherProps = {
  currentLocale: Locale;
  label: string;
};

const options: Array<{ locale: Locale; flag: string; label: string }> = [
  { locale: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
  { locale: "en", flag: "🇬🇧", label: "English" },
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
    <div className="flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/90 px-2 py-2 text-xs font-semibold text-[var(--color-muted)] shadow-sm">
      <span className="px-2 uppercase tracking-[0.16em]">{label}</span>
      {options.map((option) => {
        const isActive = option.locale === currentLocale;

        return (
          <button
            key={option.locale}
            type="button"
            onClick={() => setLocale(option.locale)}
            disabled={isPending || isActive}
            aria-pressed={isActive}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 transition ${
              isActive
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-ink)] hover:bg-[rgba(13,78,166,0.08)]"
            } disabled:cursor-default`}
          >
            <span aria-hidden="true">{option.flag}</span>
            <span>{option.locale.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}
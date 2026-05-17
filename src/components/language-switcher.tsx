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
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-base transition ${
              isActive
                ? "bg-[var(--color-primary)] shadow-sm"
                : "hover:bg-[rgba(13,78,166,0.08)]"
            } disabled:cursor-default`}
          >
            <span>{option.flag}</span>
          </button>
        );
      })}
    </div>
  );
}
import Link from "next/link";

type FloatingHomeShortcutProps = {
  label?: string;
  bottom?: boolean;
  compact?: boolean;
  tone?: "primary" | "sun";
};

export function FloatingHomeShortcut({
  label = "Trang chủ",
  bottom = false,
  compact = false,
  tone = "primary",
}: FloatingHomeShortcutProps) {
  const positionClass = bottom
    ? "bottom-4 right-4"
    : "right-0 top-1/2 -translate-y-1/2";
  const toneClass = tone === "sun"
    ? "bg-[#f97316] hover:bg-[#ea580c] shadow-[0_16px_28px_rgba(249,115,22,0.38)]"
    : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] shadow-[0_16px_28px_rgba(13,45,98,0.3)]";

  return (
    <Link
      href="/"
      className={`fixed z-40 ${positionClass} ${compact ? "flex h-12 w-12 items-center justify-center rounded-2xl" : "rounded-l-2xl px-3 py-3"} ${toneClass} text-sm font-semibold text-white transition`}
      aria-label={label}
      title={label}
    >
      {compact ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M3 11.5L12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10.5V20h14v-9.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : label}
    </Link>
  );
}

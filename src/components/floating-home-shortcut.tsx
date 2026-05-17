import Link from "next/link";

type FloatingHomeShortcutProps = {
  label?: string;
  bottom?: boolean;
  compact?: boolean;
};

export function FloatingHomeShortcut({
  label = "Trang chủ",
  bottom = false,
  compact = false,
}: FloatingHomeShortcutProps) {
  const positionClass = bottom
    ? "bottom-4 right-4"
    : "right-0 top-1/2 -translate-y-1/2";

  return (
    <Link
      href="/"
      className={`fixed z-40 ${positionClass} ${compact ? "rounded-2xl" : "rounded-l-2xl"} bg-[var(--color-primary)] px-3 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(13,45,98,0.3)] transition hover:bg-[var(--color-primary-strong)]`}
      aria-label={label}
      title={label}
    >
      {label}
    </Link>
  );
}

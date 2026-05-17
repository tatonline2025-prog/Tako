import Link from "next/link";

type FloatingZaloShortcutProps = {
  href: string;
  label?: string;
};

export function FloatingZaloShortcut({
  href,
  label = "Zalo",
}: FloatingZaloShortcutProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16a34a] text-sm font-semibold text-white shadow-[0_16px_28px_rgba(22,163,74,0.35)] transition hover:bg-[#15803d]"
      aria-label={label}
      title={label}
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold">Z</span>
    </Link>
  );
}

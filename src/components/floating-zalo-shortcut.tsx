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
      className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 rounded-2xl bg-[#0068ff] px-3 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(0,104,255,0.32)] transition hover:bg-[#0055d4]"
      aria-label={label}
      title={label}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/22 text-xs font-bold">Z</span>
      {label}
    </Link>
  );
}

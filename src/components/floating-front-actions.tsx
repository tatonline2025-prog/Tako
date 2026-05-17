"use client";

import { usePathname } from "next/navigation";
import { FloatingHomeShortcut } from "@/components/floating-home-shortcut";
import { FloatingZaloShortcut } from "@/components/floating-zalo-shortcut";

type FloatingFrontActionsProps = {
  homeLabel: string;
  zaloLabel: string;
  zaloUrl: string;
};

export function FloatingFrontActions({
  homeLabel,
  zaloLabel,
  zaloUrl,
}: FloatingFrontActionsProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/quan-tri") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <FloatingZaloShortcut href={zaloUrl} label={zaloLabel} />
      <FloatingHomeShortcut label={homeLabel} bottom compact />
    </>
  );
}

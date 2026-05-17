"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { FloatingHomeShortcut } from "@/components/floating-home-shortcut";

const navItems = [
  {
    href: "/quan-tri",
    label: "Tổng quan",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    exact: true,
    tone: "from-sky-500 to-blue-600",
  },
  {
    href: "/quan-tri/san-pham",
    label: "Sản phẩm",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    exact: false,
    tone: "from-emerald-500 to-teal-600",
  },
  {
    href: "/quan-tri/tin-tuc",
    label: "Tin tức",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 20V14H7M7 8h3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    exact: false,
    tone: "from-fuchsia-500 to-violet-600",
  },
  {
    href: "/quan-tri/noi-dung",
    label: "Nội dung",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <path d="M4 6h16M4 12h10M4 18h8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    exact: false,
    tone: "from-amber-500 to-orange-600",
  },
  {
    href: "/quan-tri/nguoi-dung",
    label: "Người dùng",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 8h4M19 6v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    exact: false,
    tone: "from-cyan-500 to-sky-600",
  },
  {
    href: "/quan-tri/cai-dat",
    label: "Cài đặt",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    exact: false,
    tone: "from-slate-500 to-slate-700",
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="fixed inset-0 z-[999] flex overflow-hidden bg-[radial-gradient(circle_at_top_right,#dbeafe_0%,#f8fbff_45%,#eff6ff_100%)]">
      <aside className="hidden w-72 flex-col border-r border-slate-200/80 bg-white/90 backdrop-blur lg:flex">
        <div className="border-b border-slate-200/80 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0d2d62,#2e7ef7)] text-white">
                <svg width="22" height="22" viewBox="0 0 38 38" fill="none">
                  <rect x="9" y="10" width="20" height="4.5" rx="2.25" fill="white" />
                  <rect x="15.5" y="14.5" width="7" height="14.5" rx="3.5" fill="white" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">TAKO Admin</div>
                <div className="text-xs text-slate-500">Bảng điều khiển nội dung</div>
              </div>
            </div>
            <form action="/api/admin/logout" method="post">
              <input type="hidden" name="redirectTo" value="/admin" />
              <button
                type="submit"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                aria-label="Đăng xuất"
                title="Đăng xuất"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-3">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    active
                      ? "bg-blue-100 text-blue-700"
                      : `bg-gradient-to-br ${item.tone} text-white`
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
          <span className="font-semibold text-slate-900">TAKO Admin</span>
          <form action="/api/admin/logout" method="post">
            <input type="hidden" name="redirectTo" value="/admin" />
            <button
              type="submit"
              className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700"
            >
              Đăng xuất
            </button>
          </form>
        </div>

        <div className="flex overflow-x-auto border-b border-slate-200/80 bg-white/80 px-2 backdrop-blur lg:hidden">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 border-b-2 px-3 py-2 text-xs font-semibold transition ${
                  active
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>

      <FloatingHomeShortcut label="Trang chủ" bottom compact />
    </div>
  );
}

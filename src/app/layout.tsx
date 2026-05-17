import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import {
  navigationItems,
  siteMetadata,
} from "@/data/site";
import "./globals.css";

const bodyFont = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteMetadata.companyName} | Cong nghe sinh hoc va chan doan lam sang`,
    template: `%s | ${siteMetadata.companyName}`,
  },
  description: siteMetadata.description,
  applicationName: siteMetadata.companyName,
  keywords: [
    "TAKO Vietnam",
    "Proteomics",
    "NGS",
    "PCR",
    "Sinh hoc phan tu",
    "Chan doan lam sang",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-ink)]">
        <div className="relative isolate flex min-h-screen flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,_rgba(61,128,255,0.26),_transparent_52%),linear-gradient(180deg,_rgba(243,248,255,0.95),_rgba(243,248,255,0))]" />
          <header className="sticky top-0 z-30 border-b border-white/50 bg-[rgba(243,248,255,0.82)] backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
              <Link href="/" className="flex items-center gap-3 text-[var(--color-ink)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0d2d62,#2e7ef7)] font-[family:var(--font-display)] text-sm font-semibold tracking-[0.24em] text-white">
                  TAKO
                </span>
                <span>
                  <span className="block font-[family:var(--font-display)] text-lg font-semibold tracking-tight">
                    {siteMetadata.companyName}
                  </span>
                  <span className="block text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                    Biotechnology systems partner
                  </span>
                </span>
              </Link>

              <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--color-muted)] lg:flex">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="transition hover:text-[var(--color-ink)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <Link
                href="/lien-he"
                className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(13,45,98,0.18)] transition hover:bg-[var(--color-primary-strong)]"
              >
                Lien he bao gia
              </Link>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-[var(--color-line)] bg-white/90">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.3fr_0.8fr_0.9fr] lg:px-8">
              <div className="space-y-4">
                <h2 className="font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
                  {siteMetadata.legalName}
                </h2>
                <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)]">
                  Website demo dinh huong catalog B2B cho thiet bi, sinh pham,
                  vat tu tieu hao va giai phap cong nghe sinh hoc, y sinh phan tu,
                  chan doan lam sang.
                </p>
              </div>

              <div className="space-y-4 text-sm text-[var(--color-muted)]">
                <h3 className="font-[family:var(--font-display)] text-base font-semibold text-[var(--color-ink)]">
                  Lien ket nhanh
                </h3>
                <div className="grid gap-3">
                  {navigationItems.map((item) => (
                    <Link key={item.href} href={item.href} className="hover:text-[var(--color-ink)]">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-4 text-sm text-[var(--color-muted)]">
                <h3 className="font-[family:var(--font-display)] text-base font-semibold text-[var(--color-ink)]">
                  Lien he
                </h3>
                <p>{siteMetadata.address}</p>
                <a href={`tel:${siteMetadata.hotline.replace(/\s+/g, "")}`} className="block hover:text-[var(--color-ink)]">
                  {siteMetadata.hotline}
                </a>
                <a href={`mailto:${siteMetadata.email}`} className="block hover:text-[var(--color-ink)]">
                  {siteMetadata.email}
                </a>
                <a
                  href={siteMetadata.zaloUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] px-3 py-2 font-medium text-[var(--color-ink)] transition hover:border-[var(--color-primary)]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0068ff] text-xs font-bold text-white">
                    Z
                  </span>
                  Zalo chat
                </a>
              </div>
            </div>

            <div className="border-t border-[var(--color-line)] px-6 py-4 text-center text-xs uppercase tracking-[0.24em] text-[var(--color-muted)] lg:px-8">
              Copyright {new Date().getFullYear()} TAKO Vietnam. Chinh sach bao mat dang duoc cap nhat.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

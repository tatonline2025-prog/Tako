import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { NavBar } from "@/components/nav-bar";
import {
  getNavigationItems,
  getSiteMetadata,
} from "@/data/site";
import {
  chromeCopy,
  getRequestLocale,
  localizeText,
} from "@/lib/i18n";
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
    default: `TAKO Vietnam | Công nghệ sinh học và chẩn đoán lâm sàng`,
    template: `%s | TAKO Vietnam`,
  },
  description:
    "TAKO Vietnam phân phối thiết bị, sinh phẩm và giải pháp công nghệ sinh học cho phòng xét nghiệm, bệnh viện, trung tâm nghiên cứu và doanh nghiệp dược sinh học.",
  applicationName: "TAKO Vietnam",
  keywords: [
    "TAKO Vietnam",
    "Proteomics",
    "NGS",
    "PCR",
    "Sinh học phân tử",
    "Chẩn đoán lâm sàng",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const siteMetadata = getSiteMetadata(locale);
  const navigationItems = getNavigationItems(locale);

  return (
    <html
      lang={locale}
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-ink)]">
        <div className="relative isolate flex min-h-screen flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,_rgba(61,128,255,0.26),_transparent_52%),linear-gradient(180deg,_rgba(243,248,255,0.95),_rgba(243,248,255,0))]" />
          <NavBar
            locale={locale}
            companyName={siteMetadata.companyName}
            partnerTagline={localizeText(chromeCopy.partnerTagline, locale)}
            navigationItems={navigationItems}
            ctaLabel={localizeText(chromeCopy.cta, locale)}
            languageLabel={localizeText(chromeCopy.language, locale)}
          />

          <main className="flex-1">{children}</main>

          <footer className="border-t border-[var(--color-line)] bg-white/90">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.3fr_0.8fr_0.9fr] lg:px-8">
              <div className="space-y-4">
                <h2 className="font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
                  {siteMetadata.legalName}
                </h2>
                <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)]">
                  {localizeText(chromeCopy.footerDescription, locale)}
                </p>
              </div>

              <div className="space-y-4 text-sm text-[var(--color-muted)]">
                <h3 className="font-[family:var(--font-display)] text-base font-semibold text-[var(--color-ink)]">
                  {localizeText(chromeCopy.quickLinks, locale)}
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
                  {localizeText(chromeCopy.contact, locale)}
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
                  {localizeText(chromeCopy.zaloChat, locale)}
                </a>
              </div>
            </div>

            <div className="border-t border-[var(--color-line)] px-6 py-4 text-center text-xs uppercase tracking-[0.24em] text-[var(--color-muted)] lg:px-8">
              Copyright {new Date().getFullYear()} TAKO Vietnam. {localizeText(chromeCopy.copyright, locale)}
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

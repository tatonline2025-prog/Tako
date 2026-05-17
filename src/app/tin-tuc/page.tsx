import type { Metadata } from "next";
import { listNewsArticles } from "@/lib/catalog-repository";
import { getRequestLocale, localizeText } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Tin tức | News",
  description:
    "Các bài viết về xu hướng công nghệ sinh học, NGS, proteomics, sepsis và ứng dụng trong chẩn đoán lâm sàng.",
};

const pageCopy = {
  eyebrow: { en: "News & Insights", vi: "Tin tức" },
  heading: {
    en: "Biotech trends, policy updates and industry events from TAKO Vietnam",
    vi: "Cập nhật xu hướng công nghệ sinh học, chính sách và sự kiện từ TAKO Vietnam",
  },
  subhead: {
    en: "Articles on NGS, proteomics, molecular diagnostics, sepsis and clinical applications — for lab directors, R&D teams and healthcare organizations.",
    vi: "Theo dõi các bài viết về NGS, proteomics, chẩn đoán phân tử, sepsis và ứng dụng lâm sàng — dành cho lãnh đạo phòng lab, khối R&D và đơn vị y tế.",
  },
};

export default async function NewsPage() {
  const locale = await getRequestLocale();
  const newsArticles = await listNewsArticles();

  return (
    <div className="section-shell py-12 sm:py-16">
      <section className="space-y-4 pb-10">
        <span className="eyebrow">{localizeText(pageCopy.eyebrow, locale)}</span>
        <h1 className="section-title">{localizeText(pageCopy.heading, locale)}</h1>
        <p className="section-copy">{localizeText(pageCopy.subhead, locale)}</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {newsArticles.map((article) => (
          <article key={article.slug} className="panel px-6 py-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]">
              <span>{article.tag}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--color-primary)]" />
              <span>{article.date}</span>
            </div>
            <h2 className="mt-4 font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
              {localizeText(article.title, locale)}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              {localizeText(article.excerpt, locale)}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
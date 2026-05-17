import type { Metadata } from "next";
import Link from "next/link";
import { RichContent } from "@/components/rich-content";
import { listNewsArticlesPage } from "@/lib/catalog-repository";
import { getRequestLocale, localizeText } from "@/lib/i18n";

type NewsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

const NEWS_PAGE_SIZE = 10;
export const revalidate = 300;

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
  readMore: {
    en: "Read full article",
    vi: "Đọc toàn bộ bài viết",
  },
  pageLabel: {
    en: "Page",
    vi: "Trang",
  },
  prevPage: {
    en: "Previous",
    vi: "Trước",
  },
  nextPage: {
    en: "Next",
    vi: "Sau",
  },
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const locale = await getRequestLocale();
  const resolvedSearchParams = await searchParams;
  const requestedPage = Number.parseInt(resolvedSearchParams.page || "1", 10);
  const page = Number.isNaN(requestedPage) ? 1 : Math.max(1, requestedPage);
  const pagedNews = await listNewsArticlesPage(page, NEWS_PAGE_SIZE);
  const previousPage = pagedNews.page > 1 ? pagedNews.page - 1 : null;
  const nextPage = pagedNews.page < pagedNews.totalPages ? pagedNews.page + 1 : null;

  return (
    <div className="section-shell py-12 sm:py-16">
      <section className="space-y-4 pb-10">
        <span className="eyebrow">{localizeText(pageCopy.eyebrow, locale)}</span>
        <h1 className="section-title">{localizeText(pageCopy.heading, locale)}</h1>
        <p className="section-copy">{localizeText(pageCopy.subhead, locale)}</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {pagedNews.items.map((article) => (
          <article key={article.slug} className="panel px-6 py-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]">
              <span>{article.tag}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--color-primary)]" />
              <span>{article.date}</span>
            </div>
            <h2 className="mt-4 font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
              {localizeText(article.title, locale)}
            </h2>
            <RichContent
              html={localizeText(article.excerpt, locale)}
              className="mt-4 text-sm text-[var(--color-muted)]"
            />
            <Link
              href={`/tin-tuc/${article.slug}`}
              className="mt-4 inline-flex rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              {localizeText(pageCopy.readMore, locale)}
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-muted)]">
        <span>
          {localizeText(pageCopy.pageLabel, locale)} {pagedNews.page}/{pagedNews.totalPages}
        </span>
        <div className="flex items-center gap-2">
          {previousPage ? (
            <Link
              href={`/tin-tuc?page=${previousPage}`}
              className="rounded-full border border-[var(--color-line)] px-3 py-1.5 font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              {localizeText(pageCopy.prevPage, locale)}
            </Link>
          ) : null}
          {nextPage ? (
            <Link
              href={`/tin-tuc?page=${nextPage}`}
              className="rounded-full border border-[var(--color-line)] px-3 py-1.5 font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              {localizeText(pageCopy.nextPage, locale)}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
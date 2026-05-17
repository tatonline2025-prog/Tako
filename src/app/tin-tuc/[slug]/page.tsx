import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { RichContent } from "@/components/rich-content";
import {
  getNewsArticleBySlug,
  listNewsArticles,
} from "@/lib/catalog-repository";
import { getRequestLocale, localizeText } from "@/lib/i18n";

export const revalidate = 600;

const getCachedNewsBySlug = cache(async (slug: string) => getNewsArticleBySlug(slug));

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const copy = {
  back: {
    en: "Back to news",
    vi: "Quay lại danh sách tin tức",
  },
};

export async function generateStaticParams() {
  const articles = await listNewsArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const article = await getCachedNewsBySlug(slug);

  if (!article) {
    return { title: "Bài viết không tồn tại" };
  }

  return {
    title: localizeText(article.title, locale),
    description: localizeText(article.excerpt, locale).replace(/<[^>]+>/g, " ").trim(),
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const article = await getCachedNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="section-shell py-12 sm:py-16">
      <article className="panel px-6 py-8 lg:px-9">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]">
          <span>{article.tag}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--color-primary)]" />
          <span>{article.date}</span>
        </div>

        <h1 className="mt-5 font-[family:var(--font-display)] text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
          {localizeText(article.title, locale)}
        </h1>

        <RichContent
          html={localizeText(article.content, locale)}
          className="mt-6 text-base text-[var(--color-muted)]"
        />

        <div className="mt-8">
          <Link
            href="/tin-tuc"
            className="inline-flex rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            {localizeText(copy.back, locale)}
          </Link>
        </div>
      </article>
    </div>
  );
}

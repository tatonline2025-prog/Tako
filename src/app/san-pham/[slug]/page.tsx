import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichContent } from "@/components/rich-content";
import {
  getProductBySlug,
  listProducts,
} from "@/lib/catalog-repository";
import { getRequestLocale, localizeText } from "@/lib/i18n";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại",
    };
  }

  return {
    title: localizeText(product.name, locale),
    description: localizeText(product.shortDescription, locale).replace(/<[^>]+>/g, " ").trim(),
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const locale = await getRequestLocale();

  if (!product) {
    notFound();
  }

  const copy = {
    subcategoryLabel: localizeText({ en: "Subcategory", vi: "Danh mục cấp 2" }, locale),
    manufacturerLabel: localizeText({ en: "Manufacturer", vi: "Hãng sản xuất" }, locale),
    highlightsLabel: localizeText({ en: "Key highlights", vi: "Điểm nổi bật" }, locale),
    applicationsLabel: localizeText({ en: "Applications", vi: "Ứng dụng" }, locale),
    downloadPdf: localizeText({ en: "Download PDF", vi: "Tải tài liệu PDF" }, locale),
    requestQuote: localizeText({ en: "Request quote", vi: "Liên hệ báo giá" }, locale),
  };

  return (
    <div className="section-shell py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={`panel h-full overflow-hidden bg-gradient-to-br ${product.imageTone} p-8 text-white`}>
          <div className="inline-flex rounded-full border border-white/24 bg-white/12 px-3 py-1 text-xs uppercase tracking-[0.22em]">
            {product.manufacturer}
          </div>
          <div className="mt-10 font-[family:var(--font-display)] text-5xl font-semibold leading-tight">
            {product.imageLabel}
          </div>
          <RichContent
            html={localizeText(product.shortDescription, locale)}
            className="mt-6 max-w-xl text-sm text-white/82"
          />
        </div>

        <div className="panel space-y-6 px-6 py-8 lg:px-8">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">
              {localizeText(product.categoryName, locale)}
            </div>
            <h1 className="mt-3 font-[family:var(--font-display)] text-4xl font-semibold text-[var(--color-ink)]">
              {localizeText(product.name, locale)}
            </h1>
            <RichContent
              html={localizeText(product.description, locale)}
              className="mt-5 text-base text-[var(--color-muted)]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-[rgba(13,78,166,0.04)] px-5 py-5">
              <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">
                {copy.subcategoryLabel}
              </div>
              <div className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {product.subcategory}
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-[rgba(13,78,166,0.04)] px-5 py-5">
              <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">
                {copy.manufacturerLabel}
              </div>
              <div className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {product.manufacturer}
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
              {copy.highlightsLabel}
            </h2>
            <div className="mt-4 grid gap-3">
              {product.highlights.map((highlight) => {
                const text = localizeText(highlight, locale);
                return (
                  <div key={text} className="rounded-[1.5rem] border border-[var(--color-line)] bg-white px-5 py-4 text-sm text-[var(--color-muted)]">
                    <RichContent html={text} />
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
              {copy.applicationsLabel}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.applications.map((application) => (
                <span
                  key={application}
                  className="rounded-full bg-[rgba(13,78,166,0.08)] px-3 py-2 text-sm font-medium text-[var(--color-primary)]"
                >
                  {application}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={product.pdfPath}
              className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
            >
              {copy.downloadPdf}
            </Link>
            <Link
              href={`/lien-he?interest=${product.slug}`}
              className="rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
            >
              {copy.requestQuote}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
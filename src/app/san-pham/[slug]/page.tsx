import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/data/site";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "San pham khong ton tai",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

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
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/82">
            {product.shortDescription}
          </p>
        </div>

        <div className="panel space-y-6 px-6 py-8 lg:px-8">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">
              {product.categoryName}
            </div>
            <h1 className="mt-3 font-[family:var(--font-display)] text-4xl font-semibold text-[var(--color-ink)]">
              {product.name}
            </h1>
            <p className="mt-5 text-base leading-8 text-[var(--color-muted)]">
              {product.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-[rgba(13,78,166,0.04)] px-5 py-5">
              <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">
                Danh muc cap 2
              </div>
              <div className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {product.subcategory}
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-[rgba(13,78,166,0.04)] px-5 py-5">
              <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">
                Hang san xuat
              </div>
              <div className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {product.manufacturer}
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
              Diem noi bat
            </h2>
            <div className="mt-4 grid gap-3">
              {product.highlights.map((highlight) => (
                <div key={highlight} className="rounded-[1.5rem] border border-[var(--color-line)] bg-white px-5 py-4 text-sm leading-7 text-[var(--color-muted)]">
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
              Ung dung
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
              Tai tai lieu PDF
            </Link>
            <Link
              href={`/lien-he?interest=${product.slug}`}
              className="rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
            >
              Lien he bao gia
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import {
  categories,
  companyHighlights,
  featuredProducts,
  focusAreas,
  getSiteMetadata,
  newsArticles,
  partnerManufacturers,
} from "@/data/site";
import { getRequestLocale, localizeText, type Locale } from "@/lib/i18n";

const homeCopy = {
  eyebrow: {
    en: "B2B biotechnology solutions",
    vi: "Giải pháp công nghệ sinh học B2B",
  },
  exploreCatalog: {
    en: "Explore catalog",
    vi: "Khám phá danh mục",
  },
  featuredNews: {
    en: "Featured news",
    vi: "Tin tức nổi bật",
  },
  featuredProducts: {
    en: "Featured products",
    vi: "Sản phẩm nổi bật",
  },
  fieldOverview: {
    en: "Core sectors",
    vi: "Lĩnh vực chính",
  },
  partnerLabs: {
    en: "Labs, hospitals, and research centers",
    vi: "Phòng xét nghiệm, bệnh viện và trung tâm nghiên cứu",
  },
  partners: {
    en: "Manufacturing partners",
    vi: "Nhà sản xuất đối tác",
  },
  quote: {
    en: "Request consultation",
    vi: "Yêu cầu tư vấn",
  },
  readAllNews: {
    en: "View all articles",
    vi: "Xem tất cả bài viết",
  },
  solutionSystem: {
    en: "A platform shaped to present a manageable, searchable product system",
    vi: "Nền tảng được xây dựng để gợi mở một hệ thống sản phẩm dễ quản trị và dễ tra cứu",
  },
  stats: {
    en: [
      ["05", "Core solution groups"],
      ["10+", "Demo catalog items"],
      ["08", "Key manufacturing partners"],
    ],
    vi: [
      ["05", "Nhóm giải pháp chính"],
      ["10+", "Danh mục sản phẩm demo"],
      ["08", "Hãng đối tác tiêu biểu"],
    ],
  },
  subhead: {
    en: "TAKO Vietnam connects equipment, reagents, and workflows for laboratories, hospitals, research centers, institutes, and biotech enterprises.",
    vi: "TAKO Vietnam kết nối thiết bị, sinh phẩm và workflow ứng dụng cho phòng xét nghiệm, bệnh viện, trung tâm nghiên cứu, viện kiểm định và doanh nghiệp dược sinh học.",
  },
  workflows: {
    en: "Solutions structured around laboratory workflows",
    vi: "Danh mục giải pháp được tổ chức theo workflow phòng xét nghiệm",
  },
};

export default async function Home() {
  const locale = await getRequestLocale();
  const siteMetadata = getSiteMetadata(locale);

  return (
    <div className="pb-20">
      <section className="section-shell pt-10 pb-14 sm:pt-16 sm:pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <span className="eyebrow">{localizeText(homeCopy.eyebrow, locale)}</span>
            <div className="space-y-6">
              <h1 className="max-w-4xl font-[family:var(--font-display)] text-5xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-6xl lg:text-7xl">
                {siteMetadata.tagline}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)] sm:text-xl">
                {localizeText(homeCopy.subhead, locale)}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/san-pham"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(13,78,166,0.22)] transition hover:bg-[var(--color-primary-strong)]"
              >
                {localizeText(homeCopy.exploreCatalog, locale)}
              </Link>
              <Link
                href="/lien-he"
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-line)] bg-white px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-primary)]"
              >
                {localizeText(homeCopy.quote, locale)}
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {homeCopy.stats[locale as Locale].map(([value, label]) => (
                <div key={label} className="panel px-5 py-5">
                  <div className="font-[family:var(--font-display)] text-3xl font-semibold text-[var(--color-primary)]">
                    {value}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(70,184,245,0.28),_transparent_46%),linear-gradient(160deg,_rgba(13,45,98,0.98),_rgba(22,92,187,0.92))]" />
            <div className="relative z-10 grid gap-6 text-white">
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.24em] text-white/74">
                <span>Nang luc cot loi</span>
                <span>Since 2025</span>
              </div>

              <div className="rounded-[1.75rem] border border-white/14 bg-white/10 p-6 backdrop-blur">
                <div className="text-sm uppercase tracking-[0.2em] text-white/70">
                  Dong hanh cung
                </div>
                <div className="mt-3 font-[family:var(--font-display)] text-3xl font-semibold">
                  Phong xet nghiem, benh vien va trung tam nghien cuu
                </div>
                <p className="mt-4 text-sm leading-7 text-white/80">
                  Huong tiep can tap trung vao giao dien catalog, mo ta ky thuat,
                  tai lieu PDF va lien he bao gia thay vi mo hinh thuong mai dien tu.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {focusAreas.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.5rem] border border-white/12 bg-white/10 px-4 py-4 text-sm leading-6 text-white/86"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-16">
        <div className="panel grid gap-8 px-6 py-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="space-y-4">
            <span className="eyebrow">Định hướng phát triển</span>
            <h2 className="section-title">{localizeText(homeCopy.solutionSystem, locale)}</h2>
          </div>
          <div className="grid gap-4">
            {companyHighlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-[1.5rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(13,78,166,0.04),rgba(13,78,166,0))] px-5 py-5 text-sm leading-7 text-[var(--color-muted)]"
              >
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell pb-16">
        <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <span className="eyebrow">{localizeText(homeCopy.fieldOverview, locale)}</span>
            <h2 className="section-title">{localizeText(homeCopy.workflows, locale)}</h2>
          </div>
          <Link href="/san-pham" className="text-sm font-semibold text-[var(--color-primary)]">
            Xem toàn bộ danh mục
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-5">
          {categories.map((category) => (
            <div key={category.slug} className="panel flex h-full flex-col px-5 py-6">
              <div className="text-sm uppercase tracking-[0.22em] text-[var(--color-primary)]">
                {category.name}
              </div>
              <p className="mt-4 flex-1 text-sm leading-7 text-[var(--color-muted)]">
                {category.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {category.applications.slice(0, 2).map((application) => (
                  <span
                    key={application}
                    className="rounded-full bg-[rgba(13,78,166,0.08)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]"
                  >
                    {application}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell pb-16">
        <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <span className="eyebrow">{localizeText(homeCopy.featuredProducts, locale)}</span>
            <h2 className="section-title">4-6 giải pháp được trình bày theo mô hình catalog kỹ thuật</h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredProducts.slice(0, 6).map((product) => (
            <article key={product.slug} className="panel overflow-hidden">
              <div className={`h-52 bg-gradient-to-br ${product.imageTone} p-6 text-white`}>
                <div className="inline-flex rounded-full border border-white/22 bg-white/12 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/88">
                  {product.manufacturer}
                </div>
                <div className="mt-12 font-[family:var(--font-display)] text-3xl font-semibold leading-tight">
                  {product.imageLabel}
                </div>
              </div>
              <div className="space-y-4 px-6 py-6">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">
                    {product.categoryName}
                  </div>
                  <h3 className="mt-2 font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
                    {product.name}
                  </h3>
                </div>
                <p className="text-sm leading-7 text-[var(--color-muted)]">
                  {product.shortDescription}
                </p>
                <div className="flex gap-3">
                  <Link
                    href={`/san-pham/${product.slug}`}
                    className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Xem chi tiết
                  </Link>
                  <Link
                    href={`/lien-he?interest=${product.slug}`}
                    className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
                  >
                    Báo giá
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell pb-16">
        <div className="panel px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <span className="eyebrow">{localizeText(homeCopy.partners, locale)}</span>
              <h2 className="section-title">Mạng lưới đối tác phù hợp với cả lâm sàng và nghiên cứu</h2>
            </div>
            <div className="grid gap-3 text-sm font-semibold text-[var(--color-muted)] sm:grid-cols-4">
              {partnerManufacturers.map((partner) => (
                <div
                  key={partner}
                  className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-4 text-center"
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-16">
        <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <span className="eyebrow">{localizeText(homeCopy.featuredNews, locale)}</span>
            <h2 className="section-title">Nội dung dành cho lãnh đạo phòng lab, bệnh viện và đơn vị R&amp;D</h2>
          </div>
          <Link href="/tin-tuc" className="text-sm font-semibold text-[var(--color-primary)]">
            {localizeText(homeCopy.readAllNews, locale)}
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {newsArticles.map((article) => (
            <article key={article.slug} className="panel px-6 py-6">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">
                <span>{article.tag}</span>
                <span className="h-1 w-1 rounded-full bg-[var(--color-primary)]" />
                <span>{article.date}</span>
              </div>
              <h3 className="mt-4 font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
                {article.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {article.excerpt}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

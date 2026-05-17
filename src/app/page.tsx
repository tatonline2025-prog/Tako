import Link from "next/link";
import { RichContent } from "@/components/rich-content";
import {
  categories,
  companyHighlights,
  focusAreas,
  getSiteMetadata,
  partnerManufacturers,
} from "@/data/site";
import {
  listFeaturedProducts,
  listRecentArticles,
} from "@/lib/catalog-repository";
import { getRequestLocale, localizeText, type Locale } from "@/lib/i18n";
import { getHomeContent } from "@/lib/site-content-repository";
import { ScrollReveal } from "@/components/scroll-reveal";

export const revalidate = 300;

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
    en: "Enabling effective management and precise product discovery for B2B biotech buyers",
    vi: "Hỗ trợ quản lý hiệu quả và tra cứu sản phẩm chính xác cho khách hàng B2B công nghệ sinh học",
  },
  devDirection: {
    en: "Development direction",
    vi: "Định hướng phát triển",
  },
  viewAllCatalog: {
    en: "View full catalog",
    vi: "Xem toàn bộ danh mục",
  },
  featuredProductsTitle: {
    en: "Highlighted solutions presented in technical catalog format",
    vi: "Các giải pháp nổi bật được trình bày theo catalog kỹ thuật",
  },
  partnersTitle: {
    en: "A partner network suited for both clinical and research settings",
    vi: "Mạng lưới đối tác phù hợp với cả lâm sàng và nghiên cứu",
  },
  newsTitle: {
    en: "Content for lab leaders, hospitals and R&D units",
    vi: "Nội dung dành cho lãnh đạo phòng lab, bệnh viện và đơn vị R&D",
  },
  heroLabel: {
    en: "Core capabilities",
    vi: "Năng lực cốt lõi",
  },
  heroPartner: {
    en: "Partnering with",
    vi: "Đồng hành cùng",
  },
  heroPartnerDesc: {
    en: "Labs, hospitals and research centers",
    vi: "Phòng xét nghiệm, bệnh viện và trung tâm nghiên cứu",
  },
  heroDesc: {
    en: "Our catalog-first approach focuses on technical descriptions, downloadable documents, and direct quote requests — built for B2B biotech procurement.",
    vi: "Hướng tiếp cận tập trung vào mô tả kỹ thuật, tài liệu tải xuống và liên hệ báo giá — xây dựng cho mua sắm B2B công nghệ sinh học.",
  },
  viewDetail: {
    en: "View detail",
    vi: "Xem chi tiết",
  },
  requestQuote: {
    en: "Request quote",
    vi: "Báo giá",
  },
  stats: {
    en: [
      ["05", "Core solution groups"],
      ["10+", "Featured products"],
      ["08", "Key manufacturing partners"],
    ],
    vi: [
      ["05", "Nhóm giải pháp chính"],
      ["10+", "Sản phẩm tiêu biểu"],
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
  const homeContent = await getHomeContent();
  const featuredProducts = await listFeaturedProducts(6);
  const newsArticles = await listRecentArticles(6);

  return (
    <div className="pb-20">
      <section className="section-shell pt-10 pb-14 sm:pt-16 sm:pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <span className="eyebrow">{localizeText(homeContent.eyebrow, locale)}</span>
            <div className="space-y-6">
              <h1 className="max-w-4xl font-[family:var(--font-display)] text-5xl font-bold tracking-tight text-[var(--color-ink)] sm:text-6xl lg:text-7xl">
                {siteMetadata.tagline}
              </h1>
              <RichContent
                html={localizeText(homeContent.subhead, locale)}
                className="max-w-2xl text-lg text-[var(--color-muted)] sm:text-xl"
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/san-pham"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(13,78,166,0.28)] transition hover:bg-[var(--color-primary-strong)] hover:shadow-[0_16px_40px_rgba(13,78,166,0.40)]"
              >
                {localizeText(homeCopy.exploreCatalog, locale)}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/lien-he"
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-line)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                {localizeText(homeCopy.quote, locale)}
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {homeCopy.stats[locale as Locale].map(([value, label]) => (
                <div key={label} className="group panel px-5 py-5 transition hover:shadow-md">
                  <div className="font-[family:var(--font-display)] text-4xl font-bold text-[var(--color-primary)]">
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
                <span>{localizeText(homeCopy.heroLabel, locale)}</span>
                <span>Since 2025</span>
              </div>

              <div className="rounded-[1.75rem] border border-white/14 bg-white/10 p-6 backdrop-blur">
                <div className="text-sm uppercase tracking-[0.2em] text-white/70">
                  {localizeText(homeCopy.heroPartner, locale)}
                </div>
                <div className="mt-3 font-[family:var(--font-display)] text-3xl font-semibold">
                  {localizeText(homeCopy.heroPartnerDesc, locale)}
                </div>
                <RichContent
                  html={localizeText(homeContent.heroDesc, locale)}
                  className="mt-4 text-sm text-white/80"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {focusAreas.map((item) => (
                  <div
                    key={item.en}
                    className="rounded-[1.5rem] border border-white/12 bg-white/10 px-4 py-4 text-sm leading-6 text-white/86"
                  >
                    {localizeText(item, locale)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-16">
        <ScrollReveal variant="book">
        <div className="panel grid gap-8 px-6 py-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="space-y-4">
            <span className="eyebrow">{localizeText(homeCopy.devDirection, locale)}</span>
            <h2 className="section-title">{localizeText(homeCopy.solutionSystem, locale)}</h2>
          </div>
          <div className="grid gap-4">
            {companyHighlights.map((highlight) => (
              <div
                key={highlight.en}
                className="rounded-[1.5rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(13,78,166,0.04),rgba(13,78,166,0))] px-5 py-5 text-sm leading-7 text-[var(--color-muted)]"
              >
                {localizeText(highlight, locale)}
              </div>
            ))}
          </div>
        </div>
        </ScrollReveal>
      </section>

      <section className="section-shell pb-16">
        <ScrollReveal variant="page">
        <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <span className="eyebrow">{localizeText(homeCopy.fieldOverview, locale)}</span>
            <h2 className="section-title">{localizeText(homeCopy.workflows, locale)}</h2>
          </div>
          <Link href="/san-pham" className="text-sm font-semibold text-[var(--color-primary)]">
            {localizeText(homeCopy.viewAllCatalog, locale)}
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => {
            const colors = [
              { bg: "bg-blue-50", text: "text-blue-700", accent: "bg-blue-600", dot: "bg-blue-500" },
              { bg: "bg-purple-50", text: "text-purple-700", accent: "bg-purple-600", dot: "bg-purple-500" },
              { bg: "bg-emerald-50", text: "text-emerald-700", accent: "bg-emerald-600", dot: "bg-emerald-500" },
              { bg: "bg-amber-50", text: "text-amber-700", accent: "bg-amber-600", dot: "bg-amber-500" },
              { bg: "bg-slate-50", text: "text-slate-700", accent: "bg-slate-600", dot: "bg-slate-500" },
            ];
            const color = colors[index % colors.length];
            return (
              <Link
                key={category.slug}
                href={`/san-pham`}
                prefetch={false}
                className="panel modern-card group flex h-full flex-col px-5 py-6 transition hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${color.bg}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${color.dot}`} />
                </div>
                <div className={`text-xs font-semibold uppercase tracking-[0.2em] ${color.text}`}>
                  {category.name}
                </div>
                <p className="mt-3 flex-1 text-sm leading-7 text-[var(--color-muted)]">
                  {localizeText(category.description, locale)}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {category.applications.slice(0, 2).map((application) => (
                    <span
                      key={application}
                      className={`rounded-full ${color.bg} px-2.5 py-0.5 text-xs font-medium ${color.text}`}
                    >
                      {application}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
        </ScrollReveal>
      </section>

      <section className="section-shell pb-16">
        <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <span className="eyebrow">{localizeText(homeCopy.featuredProducts, locale)}</span>
            <RichContent
              html={localizeText(homeContent.featuredProductsTitle, locale)}
              className="section-title"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product, i) => (
            <ScrollReveal key={product.slug} delay={i * 80}>
            <article className="panel group overflow-hidden transition hover:shadow-lg hover:-translate-y-0.5">
              <div className={`h-48 bg-gradient-to-br ${product.imageTone} p-6 text-white`}>
                <div className="inline-flex rounded-full border border-white/22 bg-white/14 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/90">
                  {product.manufacturer}
                </div>
                <div className="mt-8 font-[family:var(--font-display)] text-2xl font-bold leading-tight">
                  {product.imageLabel}
                </div>
              </div>
              <div className="space-y-3 px-6 py-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    {localizeText(product.categoryName, locale)}
                  </div>
                  <h3 className="mt-1.5 font-[family:var(--font-display)] text-xl font-semibold text-[var(--color-ink)]">
                    {localizeText(product.name, locale)}
                  </h3>
                </div>
                <RichContent
                  html={localizeText(product.shortDescription, locale)}
                  className="line-clamp-2 text-sm text-[var(--color-muted)]"
                />
                <div className="flex gap-2.5 pt-1">
                  <Link
                    href={`/san-pham/${product.slug}`}
                    prefetch={false}
                    className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--color-primary-strong)]"
                  >
                    {localizeText(homeCopy.viewDetail, locale)}
                  </Link>
                  <Link
                    href={`/lien-he?interest=${product.slug}`}
                    prefetch={false}
                    className="rounded-full border border-[var(--color-line)] px-4 py-2 text-xs font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-primary)]"
                  >
                    {localizeText(homeCopy.requestQuote, locale)}
                  </Link>
                </div>
              </div>
            </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="section-shell pb-16">
        <ScrollReveal variant="page">
        <div className="panel overflow-hidden px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <span className="eyebrow">{localizeText(homeCopy.partners, locale)}</span>
              <h2 className="section-title">{localizeText(homeCopy.partnersTitle, locale)}</h2>
            </div>
            <div className="grid grid-cols-4 gap-3 text-sm font-semibold text-[var(--color-muted)] sm:grid-cols-4 lg:max-w-lg">
              {partnerManufacturers.map((partner) => (
                <div
                  key={partner}
                  className="flex items-center justify-center rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-3.5 text-center text-xs transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      <section className="section-shell pb-16">
        <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <span className="eyebrow">{localizeText(homeCopy.featuredNews, locale)}</span>
            <h2 className="section-title">{localizeText(homeContent.newsTitle, locale)}</h2>
          </div>
          <Link href="/tin-tuc" className="text-sm font-semibold text-[var(--color-primary)]">
            {localizeText(homeCopy.readAllNews, locale)}
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {newsArticles.map((article, i) => (
            <ScrollReveal key={article.slug} delay={i * 80}>
            <article className="panel group flex flex-col overflow-hidden px-6 py-6 transition hover:shadow-lg hover:-translate-y-0.5">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">
                <span className="rounded-full bg-[rgba(13,78,166,0.1)] px-2.5 py-1 font-semibold">{article.tag}</span>
                <span className="text-[var(--color-muted)]">{article.date}</span>
              </div>
              <h3 className="mt-4 flex-1 font-[family:var(--font-display)] text-xl font-semibold leading-snug text-[var(--color-ink)]">
                {localizeText(article.title, locale)}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)] line-clamp-3">
                {localizeText(article.excerpt, locale)}
              </p>
            </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}

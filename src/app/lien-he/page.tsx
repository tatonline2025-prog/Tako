import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { categories, getSiteMetadata } from "@/data/site";
import { getProductNamesForDropdown, listProducts } from "@/lib/catalog-repository";
import { getRequestLocale, localizeText } from "@/lib/i18n";

export const revalidate = 300;

type ContactPageProps = {
  searchParams: Promise<{ interest?: string | string[] }>;
};

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Gửi yêu cầu tư vấn, báo giá và nhận hỗ trợ từ TAKO Vietnam cho danh mục sản phẩm và giải pháp công nghệ sinh học.",
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const locale = await getRequestLocale();
  const siteMetadata = getSiteMetadata(locale);
  const productNames = await getProductNamesForDropdown();
  const products = await listProducts(100);
  const query = await searchParams;
  const interestValue = Array.isArray(query.interest)
    ? query.interest[0]
    : query.interest || "";
  const requestedProduct = interestValue
    ? products.find((item) => item.slug === interestValue)
    : undefined;
  const defaultInterest = requestedProduct
    ? localizeText(requestedProduct.name, locale)
    : interestValue;
  const interestOptions = Array.from(
    new Set([
      ...categories.map((category) => category.name),
      ...productNames.map((product) => localizeText(product.name, locale)),
    ]),
  );

  return (
    <div className="section-shell py-12 sm:py-16">
      <section className="grid gap-8 pb-10 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="space-y-5">
          <span className="eyebrow">{localizeText({ en: "Contact", vi: "Liên hệ" }, locale)}</span>
          <h1 className="section-title">{localizeText({ en: "Request quotations, technical documents, or solution consulting", vi: "Yêu cầu báo giá, tài liệu kỹ thuật hoặc tư vấn giải pháp" }, locale)}</h1>
          <p className="section-copy">
            {localizeText({ en: "Every request is sent directly to your company mailbox via Resend or SMTP, helping your team reply quickly without missing opportunities.", vi: "Mỗi yêu cầu sẽ được gửi trực tiếp về email công ty qua Resend hoặc SMTP để đội ngũ phản hồi nhanh và không bỏ sót cơ hội." }, locale)}
          </p>

          <div className="grid gap-4">
            <div className="panel px-5 py-5">
              <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">{localizeText({ en: "Address", vi: "Địa chỉ" }, locale)}</div>
              <div className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{siteMetadata.address}</div>
            </div>
            <div className="panel px-5 py-5">
              <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">{localizeText({ en: "Quick contact", vi: "Liên lạc nhanh" }, locale)}</div>
              <div className="mt-3 space-y-2 text-sm leading-7 text-[var(--color-muted)]">
                <a href={`tel:${siteMetadata.hotline.replace(/\s+/g, "")}`} className="block hover:text-[var(--color-ink)]">
                  Hotline: {siteMetadata.hotline}
                </a>
                <a href={`mailto:${siteMetadata.email}`} className="block hover:text-[var(--color-ink)]">
                  Email: {siteMetadata.email}
                </a>
                <a href={siteMetadata.zaloUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full border border-[var(--color-line)] px-4 py-2 font-semibold text-[var(--color-ink)]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0068ff] text-xs font-bold text-white">Z</span>
                  {localizeText({ en: "Chat on Zalo", vi: "Chat Zalo" }, locale)}
                </a>
              </div>
            </div>
            <div className="panel px-5 py-5">
              <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">{localizeText({ en: "Interest categories", vi: "Danh mục quan tâm" }, locale)}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category.slug}
                    className="rounded-full bg-[rgba(13,78,166,0.08)] px-3 py-2 text-sm font-medium text-[var(--color-primary)]"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ContactForm
            interestOptions={interestOptions}
            defaultInterest={defaultInterest}
            locale={locale}
          />

        </div>
      </section>
    </div>
  );
}
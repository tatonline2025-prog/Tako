import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { categories, getProductBySlug, getSiteMetadata } from "@/data/site";
import { contactInterestOptions } from "@/lib/contact-schema";
import { getRequestLocale, localizeText } from "@/lib/i18n";

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
  const query = await searchParams;
  const interestValue = Array.isArray(query.interest)
    ? query.interest[0]
    : query.interest || "";
  const requestedProduct = interestValue ? getProductBySlug(interestValue) : undefined;
  const defaultInterest = requestedProduct?.name || interestValue;

  return (
    <div className="section-shell py-12 sm:py-16">
      <section className="grid gap-8 pb-10 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="space-y-5">
          <span className="eyebrow">{localizeText({ en: "Contact", vi: "Liên hệ" }, locale)}</span>
          <h1 className="section-title">{localizeText({ en: "Request quotations, technical documents, or solution consulting", vi: "Yêu cầu báo giá, tài liệu kỹ thuật hoặc tư vấn giải pháp" }, locale)}</h1>
          <p className="section-copy">
            {localizeText({ en: "The contact form is connected directly to the database so your team can review requests in one place. The system is also ready to send notifications to the company inbox once SMTP or Resend is configured.", vi: "Form liên hệ được kết nối trực tiếp với database để đội ngũ có thể xem danh sách yêu cầu từ một đầu mối. Hệ thống cũng đã sẵn sàng gửi email thông báo về hộp thư công ty khi SMTP hoặc Resend được cấu hình." }, locale)}
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
            interestOptions={contactInterestOptions}
            defaultInterest={defaultInterest}
            locale={locale}
          />

        </div>
      </section>
    </div>
  );
}
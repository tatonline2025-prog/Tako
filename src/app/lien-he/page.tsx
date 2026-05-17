import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { categories, getProductBySlug, siteMetadata } from "@/data/site";
import { contactInterestOptions } from "@/lib/contact-schema";

type ContactPageProps = {
  searchParams: Promise<{ interest?: string | string[] }>;
};

export const metadata: Metadata = {
  title: "Lien he",
  description:
    "Gui yeu cau tu van, bao gia va nhan ho tro tu TAKO Vietnam cho danh muc san pham va giai phap cong nghe sinh hoc.",
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
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
          <span className="eyebrow">Lien he</span>
          <h1 className="section-title">Yeu cau bao gia, tai lieu ky thuat hoac tu van giai phap</h1>
          <p className="section-copy">
            Form lien he duoc ket noi truc tiep voi database de doi ngu co the xem danh sach yeu cau tu mot dau moi. He thong da san sang gui email thong bao ve hop thu cong ty khi SMTP duoc cau hinh trong moi truong tri en khai.
          </p>

          <div className="grid gap-4">
            <div className="panel px-5 py-5">
              <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">Dia chi</div>
              <div className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{siteMetadata.address}</div>
            </div>
            <div className="panel px-5 py-5">
              <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">Lien lac nhanh</div>
              <div className="mt-3 space-y-2 text-sm leading-7 text-[var(--color-muted)]">
                <a href={`tel:${siteMetadata.hotline.replace(/\s+/g, "")}`} className="block hover:text-[var(--color-ink)]">
                  Hotline: {siteMetadata.hotline}
                </a>
                <a href={`mailto:${siteMetadata.email}`} className="block hover:text-[var(--color-ink)]">
                  Email: {siteMetadata.email}
                </a>
                <a href={siteMetadata.zaloUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full border border-[var(--color-line)] px-4 py-2 font-semibold text-[var(--color-ink)]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0068ff] text-xs font-bold text-white">Z</span>
                  Chat Zalo
                </a>
              </div>
            </div>
            <div className="panel px-5 py-5">
              <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">Danh muc quan tam</div>
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
          />
          <div className="panel px-6 py-5 text-sm leading-7 text-[var(--color-muted)] lg:px-8">
            Ban demo da luu lien he vao MongoDB va bao ve khu vuc xem du lieu bang dang nhap quan tri.
            <span className="font-semibold text-[var(--color-ink)]"> Dang nhap tai /dang-nhap</span> de vao
            <span className="font-semibold text-[var(--color-ink)]"> /quan-tri/lien-he</span>.
          </div>
        </div>
      </section>
    </div>
  );
}
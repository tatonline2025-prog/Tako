import type { Metadata } from "next";
import { newsArticles } from "@/data/site";

export const metadata: Metadata = {
  title: "Tin tuc",
  description:
    "Cac bai viet demo ve xu huong cong nghe sinh hoc, NGS, proteomics, sepsis va ung dung trong chan doan lam sang.",
};

export default function NewsPage() {
  return (
    <div className="section-shell py-12 sm:py-16">
      <section className="space-y-4 pb-10">
        <span className="eyebrow">Tin tuc</span>
        <h1 className="section-title">Noi dung duoc thiet ke cho lanh dao phong lab, khoi R&amp;D va don vi lam sang</h1>
        <p className="section-copy">
          Giai doan demo tap trung vao khung tin tuc de sau nay co the dang bai viet
          ve xu huong cong nghe sinh hoc, chinh sach va su kien cua TAKO Vietnam.
        </p>
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
              {article.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              {article.excerpt}
            </p>
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-[var(--color-line)] px-4 py-4 text-sm leading-7 text-[var(--color-muted)]">
              Khung bai viet da san sang de ket noi voi he quan tri tin tuc sau nay.
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
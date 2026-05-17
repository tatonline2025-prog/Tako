import type { Metadata } from "next";
import { newsArticles } from "@/data/site";

export const metadata: Metadata = {
  title: "Tin tức",
  description:
    "Các bài viết demo về xu hướng công nghệ sinh học, NGS, proteomics, sepsis và ứng dụng trong chẩn đoán lâm sàng.",
};

export default function NewsPage() {
  return (
    <div className="section-shell py-12 sm:py-16">
      <section className="space-y-4 pb-10">
        <span className="eyebrow">Tin tức</span>
        <h1 className="section-title">Cập nhật xu hướng công nghệ sinh học, chính sách và sự kiện từ TAKO Vietnam</h1>
        <p className="section-copy">
          Theo dõi các bài viết về NGS, proteomics, chẩn đoán phân tử, sepsis và ứng dụng lâm sàng — dành cho lãnh đạo phòng lab, khối R&amp;D và đơn vị y tế.
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

          </article>
        ))}
      </div>
    </div>
  );
}
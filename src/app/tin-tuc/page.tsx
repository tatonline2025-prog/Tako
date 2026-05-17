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
        <h1 className="section-title">Nội dung được thiết kế cho lãnh đạo phòng lab, khối R&amp;D và đơn vị lâm sàng</h1>
        <p className="section-copy">
          Giai đoạn demo tập trung vào khung tin tức để sau này có thể đăng bài viết
          về xu hướng công nghệ sinh học, chính sách và sự kiện của TAKO Vietnam.
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
              Khung bài viết đã sẵn sàng để kết nối với hệ quản trị tin tức sau này.
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
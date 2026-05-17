import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { listNewsArticles, listProducts } from "@/lib/catalog-repository";
import { categories } from "@/data/site";
import { getMailSetupStatus } from "@/lib/mailer";

export const metadata: Metadata = {
  title: "Quản trị — TAKO Vietnam",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminDashboardPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    redirect("/admin?redirectTo=/quan-tri");
  }

  const [products, newsArticles, mailStatus] = await Promise.all([
    listProducts(),
    listNewsArticles(),
    getMailSetupStatus(),
  ]);

  const statCards = [
    {
      label: "Sản phẩm",
      value: products.length,
      sub: `${products.filter((p) => p.featured).length} sản phẩm nổi bật`,
      href: "/quan-tri/san-pham",
      tone: "from-blue-500 to-cyan-500",
    },
    {
      label: "Tin tức",
      value: newsArticles.length,
      sub: "Danh sách bài viết hiện có",
      href: "/quan-tri/tin-tuc",
      tone: "from-fuchsia-500 to-violet-600",
    },
    {
      label: "Danh mục",
      value: categories.length,
      sub: "Nhóm giải pháp",
      href: "/quan-tri/san-pham",
      tone: "from-emerald-500 to-teal-600",
    },
    {
      label: "Email liên hệ",
      value: mailStatus.activeProvider ? "Sẵn sàng" : "Cần cấu hình",
      sub: mailStatus.activeProvider ? `Đang dùng ${mailStatus.activeProvider.toUpperCase()}` : "Thiết lập ở mục Cài đặt",
      href: "/quan-tri/cai-dat",
      tone: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-[linear-gradient(140deg,#0f172a,#1d4ed8,#0ea5e9)] px-6 py-7 text-white shadow-[0_30px_80px_rgba(14,31,78,0.36)]">
        <h1 className="text-2xl font-bold">Bảng điều khiển quản trị</h1>
        <p className="mt-2 text-sm text-white/85">
          Chào {admin.username}. Bạn có thể chỉnh sản phẩm, tin tức và nội dung website ngay tại đây.
        </p>
        <div className="mt-3 inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          Vai trò: {admin.role === "admin" ? "Admin" : "Manager"}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className={`inline-flex rounded-xl bg-gradient-to-br px-3 py-2 text-sm font-semibold text-white ${card.tone}`}>
              {card.value}
            </div>
            <div className="mt-3 text-sm font-semibold text-slate-900">{card.label}</div>
            <div className="mt-1 text-xs text-slate-500">{card.sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Truy cập nhanh</h2>
          <div className="mt-4 space-y-2">
            {[
              { label: "Quản lý sản phẩm", href: "/quan-tri/san-pham" },
              { label: "Quản lý tin tức", href: "/quan-tri/tin-tuc" },
              { label: "Biên tập nội dung", href: "/quan-tri/noi-dung" },
              { label: "Cài đặt email", href: "/quan-tri/cai-dat" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
              >
                {item.label}
                <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="font-semibold text-slate-900">Gợi ý vận hành</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Ưu tiên cập nhật đủ nội dung tiếng Việt và tiếng Anh khi chỉnh sửa.",
              "Dùng định dạng rich-text để bài viết và mô tả sản phẩm dễ đọc hơn.",
              "Kiểm tra lại đường dẫn PDF trước khi bấm Lưu sản phẩm.",
              "Đặt Resend hoặc SMTP làm kênh nhận liên hệ chính trong mục Cài đặt.",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

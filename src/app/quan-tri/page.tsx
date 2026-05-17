import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { getNewsCount, getProductCount } from "@/lib/catalog-repository";
import { getContactStatusCounts } from "@/lib/contact-repository";

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

  const [productCount, newsCount, contactSummary] = await Promise.all([
    getProductCount(),
    getNewsCount(),
    getContactStatusCounts(),
  ]);

  const chartData = [
    {
      label: "Sản phẩm",
      value: productCount,
      tone: "bg-blue-500",
    },
    {
      label: "Tin tức",
      value: newsCount,
      tone: "bg-violet-500",
    },
    {
      label: "Liên hệ mới",
      value: contactSummary.newCount,
      tone: "bg-amber-500",
    },
    {
      label: "Liên hệ đã xử lý",
      value: contactSummary.handledCount,
      tone: "bg-emerald-500",
    },
  ];
  const maxValue = Math.max(...chartData.map((item) => item.value), 1);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-xl font-semibold text-slate-900">Xin chào {admin.username}</h1>
        <p className="mt-1 text-sm text-slate-500">Quản trị nhanh nội dung website từ một màn hình gọn gàng.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Biểu đồ tổng quan</h2>
          <div className="mt-4 space-y-3">
            {chartData.map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="font-semibold text-slate-900">{item.value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${item.tone}`}
                    style={{ width: `${Math.max(8, Math.round((item.value / maxValue) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Tình trạng CRM</h2>
          <div className="mt-3 grid gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tổng liên hệ</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{contactSummary.total}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">Mới</div>
                <div className="mt-1 text-xl font-bold text-amber-900">{contactSummary.newCount}</div>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Đã xử lý</div>
                <div className="mt-1 text-xl font-bold text-emerald-900">{contactSummary.handledCount}</div>
              </div>
            </div>
          </div>
          <Link href="/quan-tri/lien-he" prefetch={false} className="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700">
            Mở CRM liên hệ
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <h2 className="text-sm font-semibold text-slate-900">Truy cập nhanh</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          <Link href="/quan-tri/san-pham" prefetch={false} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:border-blue-200 hover:bg-blue-50">Sản phẩm</Link>
          <Link href="/quan-tri/tin-tuc" prefetch={false} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:border-blue-200 hover:bg-blue-50">Tin tức</Link>
          <Link href="/quan-tri/noi-dung" prefetch={false} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:border-blue-200 hover:bg-blue-50">Nội dung</Link>
          <Link href="/quan-tri/lien-he" prefetch={false} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:border-blue-200 hover:bg-blue-50">CRM liên hệ</Link>
        </div>
      </div>
    </div>
  );
}

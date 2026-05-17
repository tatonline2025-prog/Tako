import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { listNewsArticles, listProducts } from "@/lib/catalog-repository";

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

  const [products, newsArticles] = await Promise.all([
    listProducts(),
    listNewsArticles(),
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-xl font-semibold text-slate-900">Xin chào {admin.username}</h1>
        <p className="mt-1 text-sm text-slate-500">Quản trị nhanh nội dung website từ một màn hình gọn gàng.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Sản phẩm</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{products.length}</div>
          <Link href="/quan-tri/san-pham" className="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700">
            Mở quản lý sản phẩm
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tin tức</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{newsArticles.length}</div>
          <Link href="/quan-tri/tin-tuc" className="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700">
            Mở quản lý tin tức
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <h2 className="text-sm font-semibold text-slate-900">Truy cập nhanh</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Link href="/quan-tri/san-pham" className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:border-blue-200 hover:bg-blue-50">Sản phẩm</Link>
          <Link href="/quan-tri/tin-tuc" className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:border-blue-200 hover:bg-blue-50">Tin tức</Link>
          <Link href="/quan-tri/noi-dung" className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:border-blue-200 hover:bg-blue-50">Nội dung</Link>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { categories } from "@/data/site";
import { AdminProductManager } from "@/components/admin-product-manager";
import { listProducts } from "@/lib/catalog-repository";

export const metadata: Metadata = {
  title: "Quản lý sản phẩm — TAKO Vietnam",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminProductsPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    redirect("/admin?redirectTo=/quan-tri/san-pham");
  }

  const products = await listProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sản phẩm</h1>
          <p className="mt-1 text-sm text-gray-500">{products.length} sản phẩm trong danh mục</p>
        </div>
        <Link
          href="/san-pham"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Xem trang công khai
        </Link>
      </div>

      {/* Category summary */}
      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat.slug).length;
          return (
            <div key={cat.slug} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <div className="text-lg font-bold text-gray-900">{count}</div>
              <div className="mt-0.5 text-xs text-gray-500 leading-tight">{cat.name}</div>
            </div>
          );
        })}
      </div>

      <AdminProductManager categories={categories} initialProducts={products} />
    </div>
  );
}

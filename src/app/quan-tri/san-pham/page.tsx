import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { products, categories } from "@/data/site";

export const metadata: Metadata = {
  title: "Quản lý sản phẩm — TAKO Vietnam",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

export default async function AdminProductsPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    redirect("/admin?redirectTo=/quan-tri/san-pham");
  }

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

      {/* Products table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hãng SX</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nổi bật</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.slug} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{product.shortDescription}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{product.manufacturer}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {categoryMap[product.category] ?? product.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {product.featured ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        Nổi bật
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/san-pham/${product.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Xem →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

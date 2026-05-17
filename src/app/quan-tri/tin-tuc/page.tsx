import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { newsArticles } from "@/data/site";

export const metadata: Metadata = {
  title: "Quản lý tin tức — TAKO Vietnam",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminNewsPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    redirect("/admin?redirectTo=/quan-tri/tin-tuc");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tin tức</h1>
          <p className="mt-1 text-sm text-gray-500">{newsArticles.length} bài viết</p>
        </div>
        <Link
          href="/tin-tuc"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Xem trang công khai
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tiêu đề</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nhãn</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trang</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {newsArticles.map((article) => (
              <tr key={article.slug} className="hover:bg-gray-50 transition">
                <td className="px-5 py-4">
                  <div className="font-medium text-gray-900">{article.title.vi}</div>
                  <div className="mt-0.5 text-xs text-gray-400 line-clamp-2">{article.excerpt.vi}</div>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                    {article.tag}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-500 text-xs">
                  {new Date(article.date).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/tin-tuc`}
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
  );
}

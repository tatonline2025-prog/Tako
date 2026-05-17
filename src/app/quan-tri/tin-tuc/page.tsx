import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { AdminNewsManager } from "@/components/admin-news-manager";
import { listNewsArticles } from "@/lib/catalog-repository";

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

  const newsArticles = await listNewsArticles();

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

      <AdminNewsManager initialArticles={newsArticles} />
    </div>
  );
}

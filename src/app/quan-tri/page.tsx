import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import {
  listNewsArticles,
  listProducts,
} from "@/lib/catalog-repository";
import { listContacts } from "@/lib/contact-repository";
import { categories } from "@/data/site";

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

  let contactCount = 0;
  let recentContacts: Awaited<ReturnType<typeof listContacts>> = [];
  let dbOk = true;

  try {
    recentContacts = await listContacts();
    contactCount = recentContacts.length;
  } catch {
    dbOk = false;
  }

  const [products, newsArticles] = await Promise.all([
    listProducts(),
    listNewsArticles(),
  ]);

  const statCards = [
    {
      label: "Yêu cầu liên hệ",
      value: dbOk ? contactCount : "—",
      sub: dbOk ? "Lưu trong MongoDB" : "DB chưa kết nối",
      href: "/quan-tri/lien-he",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Sản phẩm",
      value: products.length,
      sub: `${products.filter((p) => p.featured).length} nổi bật`,
      href: "/quan-tri/san-pham",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Bài viết tin tức",
      value: newsArticles.length,
      sub: "Dữ liệu tĩnh",
      href: "/quan-tri/tin-tuc",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Danh mục",
      value: categories.length,
      sub: "Lĩnh vực sản phẩm",
      href: "/quan-tri/san-pham",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="mt-1 text-sm text-gray-500">
          Xin chào, <span className="font-semibold">{admin.username}</span>. Đây là bảng điều khiển TAKO Vietnam.
        </p>
        <div className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
          Vai trò: {admin.role === "admin" ? "Admin" : "Manager"}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex rounded-xl p-2.5 ${card.bg}`}>
              <span className={`text-2xl font-bold ${card.color}`}>{card.value}</span>
            </div>
            <div className="mt-3 font-semibold text-gray-900">{card.label}</div>
            <div className="mt-0.5 text-xs text-gray-400">{card.sub}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Truy cập nhanh</h2>
          <div className="mt-4 space-y-2">
            {[
              { label: "Xem danh sách liên hệ", href: "/quan-tri/lien-he" },
              { label: "Danh sách sản phẩm", href: "/quan-tri/san-pham" },
              { label: "Quản lý tin tức", href: "/quan-tri/tin-tuc" },
              { label: "Cài đặt hệ thống", href: "/quan-tri/cai-dat" },
              { label: "Xem trang chủ công khai", href: "/" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                {item.label}
                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent contacts */}
        <div className="col-span-1 rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Liên hệ gần đây</h2>
            <Link href="/quan-tri/lien-he" className="text-xs font-medium text-blue-600 hover:underline">
              Xem tất cả →
            </Link>
          </div>

          {!dbOk ? (
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-4 text-sm text-amber-800">
              Chưa kết nối MongoDB. Cài đặt biến môi trường <code className="font-mono">MONGODB_URI</code> và <code className="font-mono">MONGODB_DB</code> trên Vercel.
            </div>
          ) : recentContacts.length === 0 ? (
            <p className="mt-4 text-sm text-gray-400">Chưa có yêu cầu liên hệ nào.</p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {recentContacts.slice(0, 5).map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-3 font-medium text-gray-900">{c.fullName}</td>
                      <td className="px-4 py-3 text-gray-500">{c.email}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Site overview */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">Thông tin website</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Domain</div>
            <div className="mt-1 font-medium text-gray-700">takob.vercel.app</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Ngôn ngữ</div>
            <div className="mt-1 font-medium text-gray-700">Tiếng Việt &amp; Tiếng Anh</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Platform</div>
            <div className="mt-1 font-medium text-gray-700">Next.js 15 · Vercel</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">Audit phạm vi quản trị</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Trang chủ", status: "Có editor nội dung", tone: "bg-emerald-50 text-emerald-700" },
            { name: "Sản phẩm", status: "CRUD đầy đủ", tone: "bg-emerald-50 text-emerald-700" },
            { name: "Tin tức", status: "CRUD đầy đủ", tone: "bg-emerald-50 text-emerald-700" },
            { name: "Liên hệ", status: "Đọc danh sách lead", tone: "bg-blue-50 text-blue-700" },
            { name: "Cài đặt hệ thống", status: admin.role === "admin" ? "Admin-only" : "Không có quyền", tone: admin.role === "admin" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700" },
            { name: "Giới thiệu", status: "Có editor nội dung", tone: "bg-emerald-50 text-emerald-700" },
          ].map((item) => (
            <div key={item.name} className="rounded-xl border border-gray-200 px-4 py-3">
              <div className="text-sm font-semibold text-gray-900">{item.name}</div>
              <div className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${item.tone}`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

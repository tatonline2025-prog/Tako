import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminContentManager } from "@/components/admin-content-manager";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import {
  getAboutContent,
  getHomeContent,
} from "@/lib/site-content-repository";

export const metadata: Metadata = {
  title: "Quản lý nội dung — TAKO Vietnam",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminContentPage() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect("/admin?redirectTo=/quan-tri/noi-dung");
  }

  const [initialHome, initialAbout] = await Promise.all([
    getHomeContent(),
    getAboutContent(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý nội dung</h1>
        <p className="mt-1 text-sm text-gray-500">Biên tập text cho Trang chủ và Giới thiệu bằng JSON editor.</p>
      </div>

      <AdminContentManager initialHome={initialHome} initialAbout={initialAbout} />
    </div>
  );
}

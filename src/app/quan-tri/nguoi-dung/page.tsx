import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminUsersManager } from "@/components/admin-users-manager";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { listAdminUsers } from "@/lib/admin-users-repository";

export const metadata: Metadata = {
  title: "Quản lý người dùng — TAKO Vietnam",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminUsersPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    redirect("/admin?redirectTo=/quan-tri/nguoi-dung");
  }

  if (admin.role !== "admin") {
    redirect("/quan-tri");
  }

  const users = await listAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Người dùng quản trị</h1>
        <p className="mt-1 text-sm text-gray-500">Thêm, sửa, xóa tài khoản quản trị trực tiếp trong hệ thống.</p>
      </div>

      <AdminUsersManager currentUsername={admin.username} initialUsers={users} />
    </div>
  );
}

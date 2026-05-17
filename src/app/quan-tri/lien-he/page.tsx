import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminContactsManager } from "@/components/admin-contacts-manager";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { listContacts } from "@/lib/contact-repository";

export const metadata: Metadata = {
  title: "CRM liên hệ — TAKO Vietnam",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminContactPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    redirect("/admin?redirectTo=/quan-tri/lien-he");
  }

  const contacts = await listContacts(500);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">CRM liên hệ</h1>
        <p className="mt-1 text-base text-gray-600">Lưu trữ và theo dõi toàn bộ yêu cầu khách hàng gửi từ website.</p>
      </div>

      <AdminContactsManager initialContacts={contacts} />
    </div>
  );
}

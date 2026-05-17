import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { listContacts } from "@/lib/contact-repository";

export const metadata: Metadata = {
  title: "Yêu cầu liên hệ — TAKO Vietnam",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminContactsPage() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect("/admin?redirectTo=/quan-tri/lien-he");
  }

  let contacts: Awaited<ReturnType<typeof listContacts>> = [];
  let dbOk = true;
  try {
    contacts = await listContacts();
  } catch {
    dbOk = false;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Yêu cầu liên hệ</h1>
        <p className="mt-1 text-sm text-gray-500">{dbOk ? `${contacts.length} yêu cầu đã nhận` : "Chưa kết nối MongoDB"}</p>
      </div>

      {!dbOk && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
          Chưa kết nối MongoDB. Vui lòng cài đặt <code className="font-mono">MONGODB_URI</code> và <code className="font-mono">MONGODB_DB</code> trên Vercel.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Người liên hệ</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Công ty</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quan tâm</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nội dung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 align-top text-xs text-gray-400">
                      {new Date(contact.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="font-medium text-gray-900">{contact.fullName}</div>
                      <div className="text-xs text-gray-500">{contact.email}</div>
                      <div className="text-xs text-gray-500">{contact.phone}</div>
                    </td>
                    <td className="px-5 py-4 align-top text-gray-600">{contact.company}</td>
                    <td className="px-5 py-4 align-top text-gray-600">{contact.interest}</td>
                    <td className="px-5 py-4 align-top text-gray-600">{contact.message}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                    Chưa có yêu cầu liên hệ nào trong database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
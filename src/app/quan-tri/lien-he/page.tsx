import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { listContacts } from "@/lib/contact-repository";

export const metadata: Metadata = {
  title: "Danh sach lien he",
  description: "Trang demo de xem cac yeu cau lien he da luu trong MongoDB.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminContactsPage() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect("/dang-nhap?redirectTo=/quan-tri/lien-he");
  }

  const contacts = await listContacts();

  return (
    <div className="section-shell py-12 sm:py-16">
      <section className="flex flex-col gap-5 pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <span className="eyebrow">Quan tri demo</span>
          <h1 className="section-title">Danh sach lien he da luu vao database</h1>
          <p className="section-copy">
            Khu vuc nay da duoc bao ve bang dang nhap quan tri va chi hien thi cho phien da xac thuc.
          </p>
        </div>

        <form action="/api/admin/logout" method="post">
          <input type="hidden" name="redirectTo" value="/dang-nhap" />
          <button
            type="submit"
            className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
          >
            Dang xuat ({admin.username})
          </button>
        </form>
      </section>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--color-line)] text-left text-sm">
            <thead className="bg-[rgba(13,78,166,0.04)] text-[var(--color-ink)]">
              <tr>
                <th className="px-5 py-4 font-semibold">Thoi gian</th>
                <th className="px-5 py-4 font-semibold">Nguoi lien he</th>
                <th className="px-5 py-4 font-semibold">Cong ty</th>
                <th className="px-5 py-4 font-semibold">Quan tam</th>
                <th className="px-5 py-4 font-semibold">Noi dung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)] bg-white">
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-5 py-5 align-top text-[var(--color-muted)]">
                      {new Date(contact.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-5 py-5 align-top text-[var(--color-muted)]">
                      <div className="font-semibold text-[var(--color-ink)]">{contact.fullName}</div>
                      <div>{contact.email}</div>
                      <div>{contact.phone}</div>
                    </td>
                    <td className="px-5 py-5 align-top text-[var(--color-muted)]">{contact.company}</td>
                    <td className="px-5 py-5 align-top text-[var(--color-muted)]">{contact.interest}</td>
                    <td className="px-5 py-5 align-top text-[var(--color-muted)]">{contact.message}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[var(--color-muted)]">
                    Chua co yeu cau lien he nao trong database.
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
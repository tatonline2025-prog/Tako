import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import {
  getAuthenticatedAdmin,
  isAdminConfigured,
  normalizeRedirectPath,
} from "@/lib/admin-auth";

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string | string[] }>;
};

export const metadata: Metadata = {
  title: "Dang nhap quan tri",
  description: "Dang nhap vao khu vuc quan tri demo cua TAKO Vietnam.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const redirectValue = Array.isArray(query.redirectTo)
    ? query.redirectTo[0]
    : query.redirectTo;
  const redirectTo = normalizeRedirectPath(redirectValue);
  const admin = await getAuthenticatedAdmin();

  if (admin) {
    redirect(redirectTo);
  }

  return (
    <div className="section-shell py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <section className="space-y-5">
          <span className="eyebrow">Khu vuc quan tri</span>
          <h1 className="section-title">Xac thuc truoc khi truy cap du lieu lien he B2B</h1>
          <p className="section-copy">
            Ban demo da co lop bao ve co ban cho khu vuc quan tri va API doc danh sach lien he. De dua len Vercel, chi can thiet lap bien moi truong admin tuong ung.
          </p>
        </section>

        <AdminLoginForm
          isConfigured={isAdminConfigured()}
          redirectTo={redirectTo}
        />
      </div>
    </div>
  );
}
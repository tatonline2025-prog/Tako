import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import {
  getAuthenticatedAdmin,
  isAdminConfigured,
  normalizeRedirectPath,
} from "@/lib/admin-auth";
import { getRequestLocale, localizeText } from "@/lib/i18n";

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string | string[] }>;
};

export const metadata: Metadata = {
  title: "Đăng nhập quản trị",
  description: "Đăng nhập vào khu vực quản trị demo của TAKO Vietnam.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const locale = await getRequestLocale();
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
          <span className="eyebrow">{localizeText({ en: "Admin area", vi: "Khu vực quản trị" }, locale)}</span>
          <h1 className="section-title">{localizeText({ en: "Authenticate before accessing B2B contact data", vi: "Xác thực trước khi truy cập dữ liệu liên hệ B2B" }, locale)}</h1>
          <p className="section-copy">
            {localizeText({ en: "This demo already protects the admin area and the contact list API. To deploy on Vercel, you only need to set the corresponding admin environment variables.", vi: "Bản demo đã có lớp bảo vệ cơ bản cho khu vực quản trị và API đọc danh sách liên hệ. Để đưa lên Vercel, chỉ cần thiết lập các biến môi trường admin tương ứng." }, locale)}
          </p>
        </section>

        <AdminLoginForm
          isConfigured={isAdminConfigured()}
          locale={locale}
          redirectTo={redirectTo}
        />
      </div>
    </div>
  );
}
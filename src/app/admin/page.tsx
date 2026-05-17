import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import {
  getAdminConfigurationStatus,
  getAuthenticatedAdmin,
  normalizeRedirectPath,
} from "@/lib/admin-auth";
import { getRequestLocale, localizeText } from "@/lib/i18n";

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string | string[] }>;
};

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: "noindex",
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const locale = await getRequestLocale();
  const query = await searchParams;
  const redirectValue = Array.isArray(query.redirectTo)
    ? query.redirectTo[0]
    : query.redirectTo;
  const redirectTo = normalizeRedirectPath(redirectValue);
  const configStatus = getAdminConfigurationStatus();
  const admin = await getAuthenticatedAdmin();

  if (admin) {
    redirect(redirectTo);
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0d2d62,#2e7ef7)] font-[family:var(--font-display)] text-sm font-bold tracking-[0.18em] text-white">
            TAKO
          </span>
          <h1 className="mt-4 font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
            {localizeText({ en: "Admin area", vi: "Khu vực quản trị" }, locale)}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {localizeText({ en: "Sign in to manage site content", vi: "Đăng nhập để quản lý nội dung website" }, locale)}
          </p>
        </div>
        <AdminLoginForm
          isConfigured={configStatus.configured}
          locale={locale}
          redirectTo={redirectTo}
        />
      </div>
    </div>
  );
}

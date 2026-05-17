import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSettingsClient } from "@/components/admin-settings-client";
import { getMailSettings } from "@/lib/admin-settings-repository";
import {
  getAuthenticatedAdmin,
} from "@/lib/admin-auth";
import { getMailSetupStatus } from "@/lib/mailer";

export const metadata: Metadata = {
  title: "Cài đặt hệ thống",
  description: "Xem trạng thái cấu hình admin, SMTP, Resend và CRM liên hệ.",
};

export default async function AdminSettingsPage() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect("/admin?redirectTo=/quan-tri/cai-dat");
  }

  if (admin.role !== "admin") {
    redirect("/quan-tri");
  }

  const mailStatus = await getMailSetupStatus();
  const storedMailSettings = await getMailSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
        <p className="mt-1 text-sm text-gray-500">Quản lý cấu hình email, CRM liên hệ, và hệ thống.</p>
      </div>

      <AdminSettingsClient
        mailStatus={mailStatus}
        storedMailSettings={storedMailSettings}
      />
    </div>
  );
}
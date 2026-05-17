import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminMailSettingsForm } from "@/components/admin-mail-settings-form";
import { getMailSettings } from "@/lib/admin-settings-repository";
import {
  getAdminConfigurationStatus,
  getAuthenticatedAdmin,
} from "@/lib/admin-auth";
import { getMailSetupStatus } from "@/lib/mailer";

export const metadata: Metadata = {
  title: "Cài đặt hệ thống",
  description: "Xem trạng thái cấu hình admin, SMTP, Resend và hướng dẫn triển khai trên Vercel.",
};

function statusBadge(configured: boolean) {
  return configured ? "Đã cấu hình" : "Chưa hoàn tất";
}

export default async function AdminSettingsPage() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect("/admin?redirectTo=/quan-tri/cai-dat");
  }

  if (admin.role !== "admin") {
    redirect("/quan-tri");
  }

  const adminStatus = getAdminConfigurationStatus();
  const mailStatus = await getMailSetupStatus();
  const storedMailSettings = await getMailSettings();
  const databaseConfigured = Boolean(process.env.MONGODB_URI && process.env.MONGODB_DB);
  const missingDatabase = [
    !process.env.MONGODB_URI ? "MONGODB_URI" : null,
    !process.env.MONGODB_DB ? "MONGODB_DB" : null,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
        <p className="mt-1 text-sm text-gray-500">Trạng thái kết nối database, email và triển khai.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Database</div>
          <div className="mt-2 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${databaseConfigured ? 'bg-emerald-500' : 'bg-red-400'}`} />
            <span className="font-semibold text-gray-900">{statusBadge(databaseConfigured)}</span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            MongoDB cần <code className="font-mono">MONGODB_URI</code> và <code className="font-mono">MONGODB_DB</code>.
          </p>
          {!databaseConfigured && (
            <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              Thiếu: {missingDatabase.join(", ")}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin auth</div>
          <div className="mt-2 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${adminStatus.configured ? 'bg-emerald-500' : 'bg-amber-400'}`} />
            <span className="font-semibold text-gray-900">{statusBadge(adminStatus.configured)}</span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Cần <code className="font-mono">ADMIN_USERNAME</code>, <code className="font-mono">ADMIN_PASSWORD</code>, <code className="font-mono">ADMIN_SESSION_SECRET</code>.
          </p>
          {!adminStatus.configured && (
            <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Thiếu: {adminStatus.missing.join(", ")}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email delivery</div>
          <div className="mt-2 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${mailStatus.activeProvider !== null ? 'bg-emerald-500' : 'bg-red-400'}`} />
            <span className="font-semibold text-gray-900">
              {mailStatus.activeProvider === "resend" ? "Đang dùng Resend" : mailStatus.activeProvider === "smtp" ? "Đang dùng SMTP" : "Chưa cài đặt"}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Ưu tiên Resend nếu có <code className="font-mono">RESEND_API_KEY</code>, dự phòng SMTP.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminMailSettingsForm initialSettings={storedMailSettings} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Gmail SMTP</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-500">
            <p>1. Bật xác minh hai bước cho tài khoản Gmail gửi mail.</p>
            <p>2. Tạo App Password tại Google Account → Security → App passwords.</p>
            <p>3. Biến: <code className="font-mono text-xs">SMTP_HOST=smtp.gmail.com</code>, <code className="font-mono text-xs">SMTP_PORT=465</code>, <code className="font-mono text-xs">SMTP_SECURE=true</code>.</p>
            <p>4. <code className="font-mono text-xs">SMTP_USER</code> = Gmail, <code className="font-mono text-xs">SMTP_PASS</code> = App Password 16 ký tự.</p>
          </div>
          {!mailStatus.smtp.configured ? (
            <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              Thiếu: {mailStatus.smtp.missing.join(", ")}
            </div>
          ) : (
            <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              SMTP đã sẵn sàng.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Resend API</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-500">
            <p>1. Tạo tài khoản Resend và xác minh domain gửi mail.</p>
            <p>2. Tạo API key rồi gán vào <code className="font-mono text-xs">RESEND_API_KEY</code>.</p>
            <p>3. <code className="font-mono text-xs">MAIL_FROM</code> bằng địa chỉ đã xác minh.</p>
            <p>4. <code className="font-mono text-xs">MAIL_TO</code> là địa chỉ nhận lead nội bộ.</p>
          </div>
          {!mailStatus.resend.configured ? (
            <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              Thiếu: {mailStatus.resend.missing.join(", ")}
            </div>
          ) : (
            <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              Resend đã sẵn sàng.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">Triển khai Vercel</h2>
        <div className="mt-3 space-y-2 text-sm text-gray-500">
          <p>1. Link project với Vercel CLI để repo có <code className="font-mono text-xs">.vercel/project.json</code>.</p>
          <p>2. Dùng script đồng bộ env từ <code className="font-mono text-xs">.env.local</code> lên các môi trường preview và production.</p>
          <p>3. Sau khi sync, deploy lại để app nạp cấu hình mới.</p>
        </div>
      </div>
    </div>
  );
}
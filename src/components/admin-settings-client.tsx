"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdminMailSettingsForm } from "./admin-mail-settings-form";
import type { MailSettings, MailSetupStatus } from "@/lib/admin-settings-repository";

type AdminSettingsClientProps = {
  mailStatus: MailSetupStatus;
  storedMailSettings: MailSettings | null;
};

export function AdminSettingsClient({
  mailStatus,
  storedMailSettings,
}: AdminSettingsClientProps) {
  const router = useRouter();
  const [showGuides, setShowGuides] = useState(false);

  const handleSaveSettings = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Hướng dẫn cài đặt email</h2>
          <button
            type="button"
            onClick={() => setShowGuides(!showGuides)}
            className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            {showGuides ? "Ẩn" : "Hiện"}
          </button>
        </div>

        {showGuides && (
          <div className="mt-4 overflow-x-auto">
            <div className="flex min-w-max gap-4 pb-2">
              <div className="w-[380px] rounded-lg border border-gray-200 bg-slate-50 p-4">
                <h3 className="font-semibold text-gray-900">Resend API</h3>
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p>1. Tạo tài khoản Resend và thêm domain gửi mail ở mục Domains.</p>
                  <p>2. Cấu hình DNS theo hướng dẫn của Resend đến khi domain hiển thị trạng thái Verified.</p>
                  <p>3. Tạo API key ở mục API Keys rồi gán vào <code className="font-mono text-xs">RESEND_API_KEY</code>.</p>
                  <p>4. <code className="font-mono text-xs">MAIL_FROM</code> bằng địa chỉ đã xác minh.</p>
                  <p>5. <code className="font-mono text-xs">MAIL_TO</code> là địa chỉ nhận lead nội bộ.</p>
                  <p>6. Bấm &quot;Gửi email test&quot; để kiểm tra key và domain đã hoạt động.</p>
                </div>
              </div>

              <div className="w-[380px] rounded-lg border border-gray-200 bg-slate-50 p-4">
                <h3 className="font-semibold text-gray-900">Gmail SMTP</h3>
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p>1. Bật xác minh hai bước cho tài khoản Gmail gửi mail.</p>
                  <p>2. Vào Google Account → Security → App passwords → chọn Mail để lấy mật khẩu 16 ký tự.</p>
                  <p>3. Biến: <code className="font-mono text-xs">SMTP_HOST=smtp.gmail.com</code>, <code className="font-mono text-xs">SMTP_PORT=465</code>, <code className="font-mono text-xs">SMTP_SECURE=true</code>.</p>
                  <p>4. <code className="font-mono text-xs">SMTP_USER</code> = Gmail, <code className="font-mono text-xs">SMTP_PASS</code> = App Password 16 ký tự.</p>
                  <p>5. Lưu cấu hình, sau đó bấm &quot;Gửi email test&quot; để xác nhận kết nối SMTP.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email delivery</div>
        <div className="mt-2 flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${mailStatus.activeProvider !== null ? "bg-emerald-500" : "bg-red-400"}`} />
          <span className="font-semibold text-gray-900">
            {mailStatus.activeProvider === "resend"
              ? "Đang dùng Resend"
              : mailStatus.activeProvider === "smtp"
                ? "Đang dùng SMTP"
                : "Chưa cài đặt"}
          </span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Ưu tiên Resend nếu có <code className="font-mono">RESEND_API_KEY</code>, dự phòng SMTP.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-1">
        <AdminMailSettingsForm initialSettings={storedMailSettings} onSave={handleSaveSettings} />
      </div>
    </div>
  );
}

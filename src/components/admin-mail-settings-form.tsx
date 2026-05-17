"use client";

import { useState, useTransition } from "react";
import type { MailSettings } from "@/lib/admin-settings-repository";

type AdminMailSettingsFormProps = {
  initialSettings: MailSettings | null;
};

export function AdminMailSettingsForm({ initialSettings }: AdminMailSettingsFormProps) {
  const [provider, setProvider] = useState<"resend" | "smtp">(initialSettings?.provider || "resend");
  const [mailFrom, setMailFrom] = useState(initialSettings?.mailFrom || "");
  const [mailTo, setMailTo] = useState(initialSettings?.mailTo || "");
  const [resendApiKey, setResendApiKey] = useState(initialSettings?.resendApiKey || "");
  const [smtpHost, setSmtpHost] = useState(initialSettings?.smtpHost || "");
  const [smtpPort, setSmtpPort] = useState(String(initialSettings?.smtpPort || 587));
  const [smtpUser, setSmtpUser] = useState(initialSettings?.smtpUser || "");
  const [smtpPass, setSmtpPass] = useState(initialSettings?.smtpPass || "");
  const [smtpSecure, setSmtpSecure] = useState(Boolean(initialSettings?.smtpSecure));
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const response = await fetch("/api/admin/settings/mail", {
        body: JSON.stringify({
          mailFrom,
          mailTo,
          provider,
          resendApiKey,
          smtpHost,
          smtpPass,
          smtpPort: Number(smtpPort),
          smtpSecure,
          smtpUser,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        setFeedback(payload.message || "Cập nhật thất bại.");
        return;
      }

      setFeedback("Đã lưu cấu hình email vào MongoDB.");
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="font-semibold text-gray-900">Cấu hình gửi email (lưu trong MongoDB)</h2>
      <p className="mt-1 text-xs text-gray-500">Thiết lập này ghi đè env server khi gửi mail lead.</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm text-gray-700">
          Provider
          <select value={provider} onChange={(event) => setProvider(event.target.value as "resend" | "smtp")} className="rounded-lg border border-gray-300 px-3 py-2">
            <option value="resend">Resend</option>
            <option value="smtp">SMTP</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm text-gray-700">
          MAIL_FROM
          <input value={mailFrom} onChange={(event) => setMailFrom(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2" placeholder="contact@takovietnam.vn" />
        </label>

        <label className="grid gap-1 text-sm text-gray-700">
          MAIL_TO
          <input value={mailTo} onChange={(event) => setMailTo(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2" placeholder="sales@takovietnam.vn" />
        </label>

        {provider === "resend" ? (
          <label className="grid gap-1 text-sm text-gray-700 md:col-span-2">
            RESEND_API_KEY
            <input value={resendApiKey} onChange={(event) => setResendApiKey(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2" placeholder="re_xxx" />
          </label>
        ) : (
          <>
            <label className="grid gap-1 text-sm text-gray-700">
              SMTP_HOST
              <input value={smtpHost} onChange={(event) => setSmtpHost(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2" placeholder="smtp.gmail.com" />
            </label>
            <label className="grid gap-1 text-sm text-gray-700">
              SMTP_PORT
              <input value={smtpPort} onChange={(event) => setSmtpPort(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2" placeholder="587" />
            </label>
            <label className="grid gap-1 text-sm text-gray-700">
              SMTP_USER
              <input value={smtpUser} onChange={(event) => setSmtpUser(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-gray-700">
              SMTP_PASS
              <input value={smtpPass} onChange={(event) => setSmtpPass(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2" />
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 md:col-span-2">
              <input type="checkbox" checked={smtpSecure} onChange={(event) => setSmtpSecure(event.target.checked)} />
              SMTP_SECURE
            </label>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button type="button" onClick={handleSave} disabled={isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {isPending ? "Đang lưu..." : "Lưu cài đặt"}
        </button>
        {feedback ? <span className="text-sm text-gray-600">{feedback}</span> : null}
      </div>
    </div>
  );
}

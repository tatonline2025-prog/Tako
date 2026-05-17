"use client";

import { useState, useTransition } from "react";
import type { MailSettings } from "@/lib/admin-settings-repository";

type AdminMailSettingsFormProps = {
  initialSettings: MailSettings | null;
  onSave?: () => void;
};

export function AdminMailSettingsForm({ initialSettings, onSave }: AdminMailSettingsFormProps) {
  const [provider, setProvider] = useState<"resend" | "smtp">(initialSettings?.provider || "resend");
  const [mailFrom, setMailFrom] = useState(initialSettings?.mailFrom || "");
  const [mailTo, setMailTo] = useState(initialSettings?.mailTo || "");
  const [resendApiKey, setResendApiKey] = useState(initialSettings?.resendApiKey || "");
  const [smtpHost, setSmtpHost] = useState(initialSettings?.smtpHost || "");
  const [smtpPort, setSmtpPort] = useState(String(initialSettings?.smtpPort || 587));
  const [smtpUser, setSmtpUser] = useState(initialSettings?.smtpUser || "");
  const [smtpPass, setSmtpPass] = useState(initialSettings?.smtpPass || "");
  const [smtpSecure, setSmtpSecure] = useState(Boolean(initialSettings?.smtpSecure));
  const [testRecipient, setTestRecipient] = useState(initialSettings?.mailTo || "");
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isTesting, startTesting] = useTransition();

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
      onSave?.();
    });
  }

  function handleTestMail() {
    startTesting(async () => {
      const response = await fetch("/api/admin/settings/mail/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to: testRecipient }),
      });

      const payload = (await response.json()) as { message?: string };
      setFeedback(payload.message || (response.ok ? "Đã gửi email test." : "Gửi email test thất bại."));
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="font-semibold text-gray-900">Cấu hình gửi email</h2>
      <p className="mt-1 text-xs text-gray-500">Thiết lập này lưu trong MongoDB và ghi đè env khi gửi mail.</p>

      <div className="mt-4 overflow-x-auto">
        <div className="inline-flex min-w-full gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setProvider("resend")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${provider === "resend" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            Resend
          </button>
          <button
            type="button"
            onClick={() => setProvider("smtp")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${provider === "smtp" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            SMTP
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
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

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={handleSave} disabled={isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {isPending ? "Đang lưu..." : "Lưu cài đặt"}
        </button>
        <input
          value={testRecipient}
          onChange={(event) => setTestRecipient(event.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="Email test (mặc định MAIL_TO)"
        />
        <button
          type="button"
          onClick={handleTestMail}
          disabled={isTesting}
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
        >
          {isTesting ? "Đang gửi..." : "Gửi test"}
        </button>
      </div>

      {feedback ? <p className="mt-3 text-sm text-gray-600">{feedback}</p> : null}
    </div>
  );
}
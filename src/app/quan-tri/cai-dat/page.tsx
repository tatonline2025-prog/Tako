import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
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

  const adminStatus = getAdminConfigurationStatus();
  const mailStatus = getMailSetupStatus();
  const databaseConfigured = Boolean(process.env.MONGODB_URI && process.env.MONGODB_DB);
  const missingDatabase = [
    !process.env.MONGODB_URI ? "MONGODB_URI" : null,
    !process.env.MONGODB_DB ? "MONGODB_DB" : null,
  ].filter(Boolean) as string[];

  return (
    <div className="section-shell py-12 sm:py-16">
      <section className="flex flex-col gap-5 pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <span className="eyebrow">Cấu hình hệ thống</span>
          <h1 className="section-title">Trạng thái cấu hình hệ thống</h1>
          <p className="section-copy">
            Theo dõi kết nối database, cấu hình email và trạng thái triển khai.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/quan-tri/lien-he"
            className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
          >
            Xem danh sách liên hệ
          </Link>
          <form action="/api/admin/logout" method="post">
            <input type="hidden" name="redirectTo" value="/admin" />
            <button
              type="submit"
              className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
            >
              Đăng xuất ({admin.username})
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="panel px-6 py-6">
          <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">Database</div>
          <h2 className="mt-3 font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
            {statusBadge(databaseConfigured)}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            Kết nối MongoDB cần `MONGODB_URI` và `MONGODB_DB`.
          </p>
          {!databaseConfigured ? (
            <div className="mt-4 rounded-[1.5rem] bg-[rgba(201,60,60,0.08)] px-4 py-4 text-sm leading-7 text-[#8c2b2b]">
              Thiếu: {missingDatabase.join(", ")}
            </div>
          ) : null}
        </article>

        <article className="panel px-6 py-6">
          <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">Admin auth</div>
          <h2 className="mt-3 font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
            {statusBadge(adminStatus.configured)}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            Cần `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` để bảo vệ khu vực quản trị.
          </p>
          {!adminStatus.configured ? (
            <div className="mt-4 rounded-[1.5rem] bg-[rgba(201,60,60,0.08)] px-4 py-4 text-sm leading-7 text-[#8c2b2b]">
              Thiếu: {adminStatus.missing.join(", ")}
            </div>
          ) : null}
        </article>

        <article className="panel px-6 py-6">
          <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">Email delivery</div>
          <h2 className="mt-3 font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
            {mailStatus.activeProvider === "resend"
              ? "Đang dùng Resend"
              : mailStatus.activeProvider === "smtp"
                ? "Đang dùng SMTP"
                : "Chưa hoàn tất"}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            Ưu tiên Resend nếu `RESEND_API_KEY` đầy đủ. Nếu chưa có, hệ thống sẽ dùng SMTP khi đủ biến.
          </p>
        </article>
      </section>

      <section className="grid gap-6 py-10 lg:grid-cols-2">
        <article className="panel px-6 py-6">
          <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">Gmail SMTP</div>
          <h2 className="mt-3 font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
            Thiết lập nhanh bằng App Password
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
            <p>1. Bật xác minh hai bước cho tài khoản Gmail gửi mail.</p>
            <p>2. Vào Google Account → Security → App passwords, tạo mật khẩu ứng dụng cho Mail.</p>
            <p>3. Điền các biến: `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`.</p>
            <p>4. Đặt `SMTP_USER` là địa chỉ Gmail, `SMTP_PASS` là App Password 16 ký tự.</p>
            <p>5. Dùng `MAIL_FROM` là email gửi và `MAIL_TO` là hộp thư nhận lead.</p>
          </div>
          {!mailStatus.smtp.configured ? (
            <div className="mt-4 rounded-[1.5rem] bg-[rgba(201,60,60,0.08)] px-4 py-4 text-sm leading-7 text-[#8c2b2b]">
              Còn thiếu cho SMTP: {mailStatus.smtp.missing.join(", ")}
            </div>
          ) : (
            <div className="mt-4 rounded-[1.5rem] bg-[rgba(23,160,112,0.10)] px-4 py-4 text-sm leading-7 text-[#0f6c50]">
              SMTP đã sẵn sàng hoạt động.
            </div>
          )}
        </article>

        <article className="panel px-6 py-6">
          <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">Resend</div>
          <h2 className="mt-3 font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
            Thiết lập gọn hơn cho production
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
            <p>1. Tạo tài khoản Resend và xác minh domain gửi mail.</p>
            <p>2. Tạo API key rồi gán vào `RESEND_API_KEY`.</p>
            <p>3. Đặt `MAIL_FROM` bằng địa chỉ đã xác minh, ví dụ `TAKO Vietnam &lt;noreply@domain.com&gt;`.</p>
            <p>4. Đặt `MAIL_TO` là địa chỉ nhận lead nội bộ.</p>
            <p>5. Khi đủ biến, hệ thống sẽ ưu tiên gửi qua Resend trước SMTP.</p>
          </div>
          {!mailStatus.resend.configured ? (
            <div className="mt-4 rounded-[1.5rem] bg-[rgba(201,60,60,0.08)] px-4 py-4 text-sm leading-7 text-[#8c2b2b]">
              Còn thiếu cho Resend: {mailStatus.resend.missing.join(", ")}
            </div>
          ) : (
            <div className="mt-4 rounded-[1.5rem] bg-[rgba(23,160,112,0.10)] px-4 py-4 text-sm leading-7 text-[#0f6c50]">
              Resend đã sẵn sàng hoạt động.
            </div>
          )}
        </article>
      </section>

      <section className="panel px-6 py-6">
        <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">Vercel</div>
        <h2 className="mt-3 font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
          Chuẩn bị để đồng bộ biến môi trường
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
          <p>1. Link project với Vercel CLI để repo có `.vercel/project.json`.</p>
          <p>2. Dùng script đồng bộ env từ `.env.local` lên các môi trường preview và production.</p>
          <p>3. Sau khi sync, deploy lại để app nạp cấu hình mail và admin mới.</p>
        </div>
      </section>
    </div>
  );
}
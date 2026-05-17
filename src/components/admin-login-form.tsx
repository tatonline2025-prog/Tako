"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type AdminLoginFormProps = {
  isConfigured: boolean;
  redirectTo: string;
  locale?: "vi" | "en";
};

export function AdminLoginForm({
  isConfigured,
  locale = "vi",
  redirectTo,
}: AdminLoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  const copy = {
    button: locale === "en" ? "Sign in" : "Đăng nhập",
    description: locale === "en"
      ? "Sign in to view contact leads and internal admin data."
      : "Đăng nhập để xem danh sách liên hệ và các dữ liệu quản trị nội bộ.",
    failed: locale === "en" ? "Sign-in failed." : "Đăng nhập thất bại.",
    password: locale === "en" ? "Password" : "Mật khẩu",
    pending: locale === "en" ? "Processing..." : "Đang xử lý...",
    systemError: locale === "en"
      ? "Unable to connect to the sign-in system."
      : "Không thể kết nối đến hệ thống đăng nhập.",
    title: locale === "en" ? "Admin sign in" : "Đăng nhập quản trị",
    username: locale === "en" ? "Admin username" : "Tài khoản quản trị",
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConfigured) {
      setFeedback("Khu vực quản trị chưa được cấu hình thông tin đăng nhập.");
      return;
    }

    setFeedback("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, redirectTo, username }),
        });

        const payload = (await response.json()) as {
          message?: string;
          redirectTo?: string;
        };

        if (!response.ok) {
          setFeedback(payload.message || copy.failed);
          return;
        }

        router.push(payload.redirectTo || redirectTo);
        router.refresh();
      } catch {
        setFeedback(copy.systemError);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="panel space-y-5 px-6 py-6 lg:px-8">
      <div className="space-y-2">
        <h1 className="font-[family:var(--font-display)] text-3xl font-semibold text-[var(--color-ink)]">
          {copy.title}
        </h1>
        <p className="text-sm leading-7 text-[var(--color-muted)]">
          {copy.description}
        </p>
      </div>

      {!isConfigured ? (
        <div className="rounded-[1.5rem] bg-[rgba(201,60,60,0.12)] px-4 py-4 text-sm leading-7 text-[#a12d2d]">
          Chưa có `ADMIN_USERNAME`, `ADMIN_PASSWORD` hoặc `ADMIN_SESSION_SECRET` trong môi trường.
        </div>
      ) : null}

      <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
        {copy.username}
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
          className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
        {copy.password}
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
        />
      </label>

      {feedback ? (
        <div className="rounded-[1.25rem] bg-[rgba(201,60,60,0.12)] px-4 py-3 text-sm leading-7 text-[#a12d2d]">
          {feedback}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending || !isConfigured}
        className="rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(13,78,166,0.22)] transition hover:bg-[var(--color-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? copy.pending : copy.button}
      </button>
    </form>
  );
}
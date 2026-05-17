"use client";

import { useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n";

type ContactFormProps = {
  interestOptions: string[];
  defaultInterest?: string;
  locale?: Locale;
};

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  message: string;
};

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  interest: "",
  message: "",
};

export function ContactForm({
  interestOptions,
  defaultInterest = "",
  locale = "vi",
}: ContactFormProps) {
  const [form, setForm] = useState<FormState>({
    ...emptyForm,
    interest: defaultInterest,
  });
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackTone, setFeedbackTone] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [isPending, startTransition] = useTransition();

  const copy = {
    company: locale === "en" ? "Company" : "Công ty",
    email: "Email",
    error: locale === "en"
      ? "Unable to submit your request right now."
      : "Không thể gửi yêu cầu lúc này.",
    fullName: locale === "en" ? "Full name" : "Họ tên",
    interest: locale === "en" ? "Product / category of interest" : "Sản phẩm / danh mục quan tâm",
    message: locale === "en" ? "Request details" : "Nội dung yêu cầu",
    pending: locale === "en" ? "Sending..." : "Đang gửi...",
    phone: locale === "en" ? "Phone number" : "Số điện thoại",
    placeholder: locale === "en" ? "Choose a product or category" : "Chọn sản phẩm hoặc danh mục",
    submit: locale === "en" ? "Submit request" : "Gửi yêu cầu",
    success: locale === "en"
      ? "Your information has been submitted successfully."
      : "Thông tin đã được gửi thành công.",
    systemError: locale === "en"
      ? "Unable to connect to the system. Please try again later."
      : "Không thể kết nối đến hệ thống. Vui lòng thử lại sau.",
  };

  function updateField<Key extends keyof FormState>(
    field: Key,
    value: FormState[Key],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    setFeedbackTone("idle");

    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        const payload = (await response.json()) as {
          message?: string;
          errors?: Record<string, string[]>;
        };

        if (!response.ok) {
          const firstError = payload.errors
            ? Object.values(payload.errors).flat()[0]
            : undefined;
          setFeedback(firstError || payload.message || copy.error);
          setFeedbackTone("error");
          return;
        }

        setForm({ ...emptyForm, interest: defaultInterest });
        setFeedback(payload.message || copy.success);
        setFeedbackTone("success");
      } catch {
        setFeedback(copy.systemError);
        setFeedbackTone("error");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="panel space-y-5 px-6 py-6 lg:px-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
          {copy.fullName}
          <input
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            required
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
          {copy.phone}
          <input
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            required
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
          {copy.company}
          <input
            value={form.company}
            onChange={(event) => updateField("company", event.target.value)}
            required
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
        {copy.interest}
        <select
          value={form.interest}
          onChange={(event) => updateField("interest", event.target.value)}
          required
          className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
        >
          <option value="">{copy.placeholder}</option>
          {interestOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
        {copy.message}
        <textarea
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          required
          rows={6}
          className="rounded-[1.5rem] border border-[var(--color-line)] bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-[var(--color-primary)]"
        />
      </label>

      {feedback ? (
        <div
          className={`rounded-[1.25rem] px-4 py-3 text-sm leading-7 ${
            feedbackTone === "success"
              ? "bg-[rgba(23,160,112,0.12)] text-[#0f6c50]"
              : "bg-[rgba(201,60,60,0.12)] text-[#a12d2d]"
          }`}
        >
          {feedback}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(13,78,166,0.22)] transition hover:bg-[var(--color-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? copy.pending : copy.submit}
      </button>
    </form>
  );
}
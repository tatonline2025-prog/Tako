"use client";

import { useState, useTransition } from "react";

type ContactFormProps = {
  interestOptions: string[];
  defaultInterest?: string;
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
          setFeedback(firstError || payload.message || "Khong the gui yeu cau luc nay.");
          setFeedbackTone("error");
          return;
        }

        setForm({ ...emptyForm, interest: defaultInterest });
        setFeedback(payload.message || "Thong tin da duoc gui thanh cong.");
        setFeedbackTone("success");
      } catch {
        setFeedback("Khong the ket noi den he thong. Vui long thu lai sau.");
        setFeedbackTone("error");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="panel space-y-5 px-6 py-6 lg:px-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
          Ho ten
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
          So dien thoai
          <input
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            required
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
          Cong ty
          <input
            value={form.company}
            onChange={(event) => updateField("company", event.target.value)}
            required
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
        San pham / danh muc quan tam
        <select
          value={form.interest}
          onChange={(event) => updateField("interest", event.target.value)}
          required
          className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
        >
          <option value="">Chon san pham hoac danh muc</option>
          {interestOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
        Noi dung yeu cau
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
        {isPending ? "Dang gui..." : "Gui yeu cau"}
      </button>
    </form>
  );
}
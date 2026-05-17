"use client";

import { useState, useTransition } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";
import type { AboutContent, HomeContent } from "@/lib/site-content-repository";

type AdminContentManagerProps = {
  initialAbout: AboutContent;
  initialHome: HomeContent;
};

type Scope = "home" | "about";
type LocaleField = "vi" | "en";

export function AdminContentManager({ initialAbout, initialHome }: AdminContentManagerProps) {
  const [scope, setScope] = useState<Scope>("home");
  const [locale, setLocale] = useState<LocaleField>("vi");
  const [homeDraft, setHomeDraft] = useState<HomeContent>(initialHome);
  const [aboutDraft, setAboutDraft] = useState<AboutContent>(initialAbout);
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateHome(field: keyof HomeContent, value: string) {
    setHomeDraft((current) => ({
      ...current,
      [field]: {
        ...current[field],
        [locale]: value,
      },
    }));
  }

  function updateAbout(field: keyof AboutContent, value: string) {
    setAboutDraft((current) => ({
      ...current,
      [field]: {
        ...current[field],
        [locale]: value,
      },
    }));
  }

  function save() {
    startTransition(async () => {
      const value = scope === "home" ? homeDraft : aboutDraft;

      const response = await fetch("/api/admin/content", {
        body: JSON.stringify({ scope, value }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        setFeedback(payload.message || "Chưa thể lưu nội dung. Vui lòng kiểm tra lại.");
        return;
      }

      setFeedback(payload.message || "Đã lưu nội dung.");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-gray-900">Danh sách trang</h2>
        <p className="mt-1 text-sm text-gray-500">
          Chọn trang cần sửa rồi cập nhật nhanh nội dung.
        </p>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => setScope("home")}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${scope === "home" ? "border-blue-300 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            <div className="font-semibold">Trang chủ</div>
            <div className="mt-0.5 text-xs">Sửa phần hero, sản phẩm nổi bật, tiêu đề tin tức</div>
          </button>
          <button
            type="button"
            onClick={() => setScope("about")}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${scope === "about" ? "border-violet-300 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            <div className="font-semibold">Giới thiệu</div>
            <div className="mt-0.5 text-xs">Sửa tầm nhìn, sứ mệnh và năng lực</div>
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs leading-6 text-gray-600">
          <div className="font-semibold text-gray-700">Gợi ý:</div>
          <div>- Dùng nút B/I/list để định dạng nhanh.</div>
          <div>- Có thể chèn ảnh bằng URL trong trình soạn thảo.</div>
          <div>- Có thể viết tiếng Việt trước, sau đó bổ sung tiếng Anh sau.</div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900">
            {scope === "home" ? "Nội dung trang chủ" : "Nội dung giới thiệu"}
          </h2>
          <div className="flex items-center gap-2">
            {(["vi", "en"] as LocaleField[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLocale(item)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                  locale === item
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {item === "vi" ? "Tiếng Việt" : "English"}
              </button>
            ))}

            <button
              type="button"
              onClick={save}
              disabled={isPending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {isPending ? "Đang lưu..." : "Lưu nội dung"}
            </button>
          </div>
        </div>

        {scope === "home" ? (
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm text-gray-700">
              Nhãn đầu trang ({locale.toUpperCase()})
              <input
                value={homeDraft.eyebrow[locale]}
                onChange={(event) => updateHome("eyebrow", event.target.value)}
                className="rounded-xl border border-gray-300 px-3 py-2"
              />
            </label>

            <RichTextEditor
              label={`Mô tả chính (${locale.toUpperCase()})`}
              value={homeDraft.subhead[locale]}
              onChange={(next) => updateHome("subhead", next)}
              minHeight={140}
            />

            <RichTextEditor
              label={`Mô tả hero (${locale.toUpperCase()})`}
              value={homeDraft.heroDesc[locale]}
              onChange={(next) => updateHome("heroDesc", next)}
              minHeight={160}
            />

            <RichTextEditor
              label={`Tiêu đề sản phẩm nổi bật (${locale.toUpperCase()})`}
              value={homeDraft.featuredProductsTitle[locale]}
              onChange={(next) => updateHome("featuredProductsTitle", next)}
              minHeight={120}
            />

            <RichTextEditor
              label={`Tiêu đề khu vực tin tức (${locale.toUpperCase()})`}
              value={homeDraft.newsTitle[locale]}
              onChange={(next) => updateHome("newsTitle", next)}
              minHeight={120}
            />
          </div>
        ) : (
          <div className="grid gap-4">
            <RichTextEditor
              label={`Tiêu đề chính (${locale.toUpperCase()})`}
              value={aboutDraft.h1[locale]}
              onChange={(next) => updateAbout("h1", next)}
              minHeight={140}
            />

            <RichTextEditor
              label={`Đoạn mở đầu 1 (${locale.toUpperCase()})`}
              value={aboutDraft.intro1[locale]}
              onChange={(next) => updateAbout("intro1", next)}
              minHeight={190}
            />

            <RichTextEditor
              label={`Đoạn mở đầu 2 (${locale.toUpperCase()})`}
              value={aboutDraft.intro2[locale]}
              onChange={(next) => updateAbout("intro2", next)}
              minHeight={170}
            />

            <RichTextEditor
              label={`Tầm nhìn (${locale.toUpperCase()})`}
              value={aboutDraft.visionText[locale]}
              onChange={(next) => updateAbout("visionText", next)}
              minHeight={150}
            />

            <RichTextEditor
              label={`Sứ mệnh (${locale.toUpperCase()})`}
              value={aboutDraft.missionText[locale]}
              onChange={(next) => updateAbout("missionText", next)}
              minHeight={150}
            />

            <RichTextEditor
              label={`Tiêu đề năng lực (${locale.toUpperCase()})`}
              value={aboutDraft.capabilityTitle[locale]}
              onChange={(next) => updateAbout("capabilityTitle", next)}
              minHeight={130}
            />

            <RichTextEditor
              label={`Mô tả năng lực (${locale.toUpperCase()})`}
              value={aboutDraft.capabilityDesc[locale]}
              onChange={(next) => updateAbout("capabilityDesc", next)}
              minHeight={140}
            />
          </div>
        )}

        {feedback ? <p className="mt-3 text-sm text-gray-700">{feedback}</p> : null}
      </div>
    </div>
  );
}

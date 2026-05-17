"use client";

import { useState, useTransition } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";
import type { NewsArticle } from "@/data/site";

type AdminNewsManagerProps = {
  initialArticles: NewsArticle[];
};

type LocaleField = "vi" | "en";

function templateArticle(): NewsArticle {
  return {
    date: new Date().toISOString().slice(0, 10),
    excerpt: { en: "", vi: "" },
    slug: "new-article",
    tag: "News",
    title: { en: "", vi: "" },
  };
}

export function AdminNewsManager({ initialArticles }: AdminNewsManagerProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [selectedSlug, setSelectedSlug] = useState(initialArticles[0]?.slug || "");
  const [draft, setDraft] = useState<NewsArticle>(initialArticles[0] || templateArticle());
  const [activeLocale, setActiveLocale] = useState<LocaleField>("vi");
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  function openArticle(article: NewsArticle) {
    setSelectedSlug(article.slug);
    setDraft(article);
    setFeedback("");
  }

  function newArticle() {
    setSelectedSlug("");
    setDraft(templateArticle());
    setFeedback("Đang tạo bài viết mới.");
  }

  function updateDraft<K extends keyof NewsArticle>(field: K, value: NewsArticle[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function updateLocalized(field: "title" | "excerpt", locale: LocaleField, value: string) {
    setDraft((current) => ({
      ...current,
      [field]: {
        ...current[field],
        [locale]: value,
      },
    }));
  }

  function saveArticle() {
    startTransition(async () => {
      const response = await fetch("/api/admin/news", {
        body: JSON.stringify(draft),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setFeedback(payload.message || "Chưa thể lưu bài viết. Vui lòng kiểm tra lại nội dung.");
        return;
      }

      const exists = articles.some((item) => item.slug === draft.slug);
      const next = exists
        ? articles.map((item) => (item.slug === draft.slug ? draft : item))
        : [draft, ...articles];

      setArticles(next);
      setSelectedSlug(draft.slug);
      setFeedback("Đã lưu bài viết.");
    });
  }

  function deleteArticle(slug: string) {
    if (!confirm(`Xóa bài viết ${slug}?`)) {
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/admin/news?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setFeedback(payload.message || "Chưa thể xóa bài viết lúc này.");
        return;
      }

      const next = articles.filter((item) => item.slug !== slug);
      setArticles(next);
      if (selectedSlug === slug) {
        const fallback = next[0] || templateArticle();
        setSelectedSlug(next[0]?.slug || "");
        setDraft(fallback);
      }
      setFeedback("Đã xóa bài viết.");
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Danh sách bài viết</h2>
            <p className="text-xs text-gray-500">{articles.length} bài viết</p>
          </div>
          <button
            type="button"
            onClick={newArticle}
            className="rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700"
          >
            + Tạo mới
          </button>
        </div>

        <div className="max-h-[760px] space-y-2 overflow-y-auto pr-1">
          {articles.map((article) => (
            <div
              key={article.slug}
              className={`rounded-xl border px-3 py-3 ${selectedSlug === article.slug ? "border-violet-300 bg-violet-50" : "border-gray-200 bg-white"}`}
            >
              <button type="button" onClick={() => openArticle(article)} className="w-full text-left">
                <div className="text-sm font-semibold text-gray-900">{article.title.vi || "(Chưa đặt tiêu đề)"}</div>
                <div className="mt-1 text-xs text-gray-500">{article.slug}</div>
              </button>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>{article.date}</span>
                <button type="button" onClick={() => deleteArticle(article.slug)} className="font-semibold text-rose-600 hover:underline">
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-gray-900">
            {selectedSlug ? `Đang sửa: ${selectedSlug}` : "Bài viết mới"}
          </h2>
          <button
            type="button"
            onClick={saveArticle}
            disabled={isPending}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {isPending ? "Đang lưu..." : "Lưu bài viết"}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm text-gray-700">
            Slug
            <input
              value={draft.slug}
              onChange={(event) => updateDraft("slug", event.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-gray-700">
            Tag
            <input
              value={draft.tag}
              onChange={(event) => updateDraft("tag", event.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-gray-700 md:col-span-2">
            Ngày đăng
            <input
              type="date"
              value={draft.date}
              onChange={(event) => updateDraft("date", event.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="flex gap-2">
            {(["vi", "en"] as LocaleField[]).map((locale) => (
              <button
                key={locale}
                type="button"
                onClick={() => setActiveLocale(locale)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                  activeLocale === locale
                    ? "bg-violet-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {locale === "vi" ? "Tiếng Việt" : "English"}
              </button>
            ))}
          </div>

          <label className="grid gap-1 text-sm text-gray-700">
            Tiêu đề ({activeLocale.toUpperCase()})
            <input
              value={draft.title[activeLocale]}
              onChange={(event) => updateLocalized("title", activeLocale, event.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
          </label>

          <RichTextEditor
            label={`Tóm tắt bài viết (${activeLocale.toUpperCase()})`}
            value={draft.excerpt[activeLocale]}
            onChange={(next) => updateLocalized("excerpt", activeLocale, next)}
            minHeight={260}
          />
        </div>

        {feedback ? <p className="mt-4 text-sm text-gray-700">{feedback}</p> : null}
      </div>
    </div>
  );
}

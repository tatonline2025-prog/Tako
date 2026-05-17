"use client";

import { useState, useTransition } from "react";
import type { NewsArticle } from "@/data/site";

type AdminNewsManagerProps = {
  initialArticles: NewsArticle[];
};

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
  const [editorText, setEditorText] = useState(
    JSON.stringify(initialArticles[0] || templateArticle(), null, 2),
  );
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  function openArticle(article: NewsArticle) {
    setSelectedSlug(article.slug);
    setEditorText(JSON.stringify(article, null, 2));
    setFeedback("");
  }

  function newArticle() {
    setSelectedSlug("");
    setEditorText(JSON.stringify(templateArticle(), null, 2));
    setFeedback("Đang tạo bài viết mới.");
  }

  function saveArticle() {
    startTransition(async () => {
      try {
        const parsed = JSON.parse(editorText) as NewsArticle;
        const response = await fetch("/api/admin/news", {
          body: JSON.stringify(parsed),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        const payload = (await response.json()) as { message?: string };

        if (!response.ok) {
          setFeedback(payload.message || "Lưu bài viết thất bại.");
          return;
        }

        const exists = articles.some((item) => item.slug === parsed.slug);
        const next = exists
          ? articles.map((item) => (item.slug === parsed.slug ? parsed : item))
          : [parsed, ...articles];
        setArticles(next);
        setSelectedSlug(parsed.slug);
        setEditorText(JSON.stringify(parsed, null, 2));
        setFeedback("Đã lưu bài viết.");
      } catch {
        setFeedback("JSON không hợp lệ. Vui lòng kiểm tra lại dữ liệu.");
      }
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
        setFeedback(payload.message || "Xóa bài viết thất bại.");
        return;
      }

      const next = articles.filter((item) => item.slug !== slug);
      setArticles(next);
      if (selectedSlug === slug) {
        const fallback = next[0] || templateArticle();
        setSelectedSlug(next[0]?.slug || "");
        setEditorText(JSON.stringify(fallback, null, 2));
      }
      setFeedback("Đã xóa bài viết.");
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Danh sách bài viết</h2>
            <p className="text-xs text-gray-500">{articles.length} bài viết</p>
          </div>
          <button
            type="button"
            onClick={newArticle}
            className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700"
          >
            + Tạo bài viết
          </button>
        </div>

        <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
          {articles.map((article) => (
            <div
              key={article.slug}
              className={`rounded-xl border px-3 py-3 ${selectedSlug === article.slug ? "border-purple-300 bg-purple-50" : "border-gray-200 bg-white"}`}
            >
              <button type="button" onClick={() => openArticle(article)} className="w-full text-left">
                <div className="text-sm font-medium text-gray-900">{article.title.vi}</div>
                <div className="mt-1 text-xs text-gray-500">{article.slug}</div>
              </button>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>{article.date}</span>
                <button type="button" onClick={() => deleteArticle(article.slug)} className="font-medium text-red-600 hover:underline">
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Text editor (JSON)</h2>
          <button
            type="button"
            onClick={saveArticle}
            disabled={isPending}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {isPending ? "Đang lưu..." : "Lưu bài viết"}
          </button>
        </div>

        <div className="mb-3 rounded-lg border border-purple-100 bg-purple-50 px-3 py-2 text-xs text-purple-700">
          Gợi ý fields bắt buộc: <span className="font-mono">slug, title.en, title.vi, excerpt.en, excerpt.vi, date, tag</span>
        </div>

        <textarea
          value={editorText}
          onChange={(event) => setEditorText(event.target.value)}
          spellCheck={false}
          className="h-[420px] w-full rounded-xl border border-gray-200 bg-[#0f172a] p-3 font-mono text-xs leading-6 text-slate-100 outline-none focus:border-purple-400"
        />

        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
          Đang sửa: {selectedSlug || "Bài viết mới"}
        </div>

        {feedback ? <p className="mt-3 text-sm text-gray-700">{feedback}</p> : null}
      </div>
    </div>
  );
}

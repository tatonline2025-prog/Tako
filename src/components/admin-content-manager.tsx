"use client";

import { useState, useTransition } from "react";

type AdminContentManagerProps = {
  initialAbout: unknown;
  initialHome: unknown;
};

export function AdminContentManager({ initialAbout, initialHome }: AdminContentManagerProps) {
  const [scope, setScope] = useState<"home" | "about">("home");
  const [homeText, setHomeText] = useState(JSON.stringify(initialHome, null, 2));
  const [aboutText, setAboutText] = useState(JSON.stringify(initialAbout, null, 2));
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      try {
        const value = JSON.parse(scope === "home" ? homeText : aboutText);
        const response = await fetch("/api/admin/content", {
          body: JSON.stringify({ scope, value }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        const payload = (await response.json()) as { message?: string };
        if (!response.ok) {
          setFeedback(payload.message || "Lưu thất bại.");
          return;
        }

        setFeedback(payload.message || "Đã lưu nội dung.");
      } catch {
        setFeedback("JSON không hợp lệ.");
      }
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-gray-900">Phạm vi quản trị nội dung</h2>
        <p className="mt-1 text-sm text-gray-500">Chỉnh text song ngữ cho các khối quan trọng mà không cần sửa code.</p>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => setScope("home")}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${scope === "home" ? "border-blue-300 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            Trang chủ
          </button>
          <button
            type="button"
            onClick={() => setScope("about")}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${scope === "about" ? "border-violet-300 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            Giới thiệu
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs leading-6 text-gray-600">
          <div className="font-semibold text-gray-700">Lưu ý:</div>
          <div>- Bắt buộc giữ đủ cặp en/vi cho từng field.</div>
          <div>- Chỉ sửa text, không đổi key JSON.</div>
          <div>- Save xong refresh tab public để xem ngay.</div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Text editor (JSON)</h2>
          <button
            type="button"
            onClick={save}
            disabled={isPending}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {isPending ? "Đang lưu..." : "Lưu nội dung"}
          </button>
        </div>

        <textarea
          spellCheck={false}
          value={scope === "home" ? homeText : aboutText}
          onChange={(event) => {
            if (scope === "home") {
              setHomeText(event.target.value);
              return;
            }
            setAboutText(event.target.value);
          }}
          className="h-[520px] w-full rounded-xl border border-gray-200 bg-[#0f172a] p-3 font-mono text-xs leading-6 text-slate-100 outline-none focus:border-blue-400"
        />

        {feedback ? <p className="mt-3 text-sm text-gray-700">{feedback}</p> : null}
      </div>
    </div>
  );
}

"use client";

import { type ChangeEvent, useEffect, useId, useRef, useState } from "react";

type RichTextEditorProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  minHeight?: number;
};

type CommandButton = {
  command: string;
  label: string;
  value?: string;
};

const commandButtons: CommandButton[] = [
  { command: "bold", label: "B" },
  { command: "italic", label: "I" },
  { command: "insertUnorderedList", label: "•" },
  { command: "insertOrderedList", label: "1." },
  { command: "formatBlock", label: "H3", value: "<h3>" },
  { command: "formatBlock", label: "P", value: "<p>" },
];

function normalizeHtml(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
}

export function RichTextEditor({
  label,
  value,
  onChange,
  minHeight = 180,
}: RichTextEditorProps) {
  const editorId = useId();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (editor.innerHTML !== value) {
      editor.innerHTML = value;
    }
  }, [value]);

  function applyCommand(command: string, commandValue?: string) {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, commandValue);
    onChange(normalizeHtml(editorRef.current.innerHTML));
  }

  function insertImage() {
    const url = prompt("Dán URL hình ảnh:");
    if (!url || !editorRef.current) {
      return;
    }

    setFeedback("");
    applyCommand("insertImage", url.trim());
  }

  function triggerFilePicker() {
    fileInputRef.current?.click();
  }

  function onImageFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !editorRef.current) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFeedback("Bạn chọn file ảnh giúp mình nhé.");
      event.target.value = "";
      return;
    }

    const maxBytes = 3 * 1024 * 1024;
    if (file.size > maxBytes) {
      setFeedback("Ảnh đang lớn hơn 3MB, bạn chọn ảnh nhỏ hơn để tải nhanh hơn.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) {
        setFeedback("Chưa đọc được file ảnh, bạn thử lại giúp mình.");
        return;
      }

      setFeedback("");
      applyCommand("insertImage", dataUrl);
    };
    reader.onerror = () => {
      setFeedback("Có lỗi khi tải ảnh lên editor, bạn thử lại nhé.");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function onInput() {
    if (!editorRef.current) return;
    onChange(normalizeHtml(editorRef.current.innerHTML));
  }

  return (
    <div className="grid gap-2">
      <label htmlFor={editorId} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
        {commandButtons.map((item) => (
          <button
            key={`${item.command}-${item.label}`}
            type="button"
            onClick={() => applyCommand(item.command, item.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-700"
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={insertImage}
          className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-700"
        >
          URL ảnh
        </button>
        <button
          type="button"
          onClick={triggerFilePicker}
          className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-700"
        >
          Tải ảnh
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageFileChange}
      />
      <div
        id={editorId}
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
        className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 text-gray-800 outline-none focus:border-blue-400"
        style={{ minHeight }}
      />
      {feedback ? <p className="text-xs text-amber-700">{feedback}</p> : null}
    </div>
  );
}

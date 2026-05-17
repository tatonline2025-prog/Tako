type RichContentProps = {
  html: string;
  className?: string;
};

function safeHtml(raw: string) {
  return raw
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
}

export function RichContent({ html, className }: RichContentProps) {
  return (
    <div
      className={["rich-content", className].filter(Boolean).join(" ")}
      dangerouslySetInnerHTML={{ __html: safeHtml(html || "") }}
    />
  );
}

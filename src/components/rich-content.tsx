import { memo, useMemo } from "react";

type RichContentProps = {
  html: string;
  className?: string;
};

function safeHtml(raw: string) {
  return raw
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
}

const RichContentComponent = ({ html, className }: RichContentProps) => {
  const sanitizedHtml = useMemo(() => safeHtml(html || ""), [html]);

  return (
    <div
      className={["rich-content", className].filter(Boolean).join(" ")}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export const RichContent = memo(RichContentComponent);

import { getProductFileById } from "@/lib/product-file-repository";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const file = await getProductFileById(id);

  if (!file) {
    return new Response("Not found", { status: 404 });
  }

  const body = new Uint8Array(file.content);

  return new Response(body, {
    headers: {
      "Content-Type": file.mimeType || "application/pdf",
      "Content-Disposition": `inline; filename="${file.fileName}"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}

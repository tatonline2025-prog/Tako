import { NextResponse } from "next/server";
import { hasAdminRole } from "@/lib/admin-auth";
import { createProductFile } from "@/lib/product-file-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  if (!(await hasAdminRole(["admin", "manager"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Thiếu file PDF." }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ message: "Chỉ hỗ trợ file .pdf" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ message: "File quá lớn (tối đa 10MB)." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const content = Buffer.from(arrayBuffer);
  const fileId = await createProductFile({
    fileName: file.name,
    mimeType: file.type || "application/pdf",
    content,
  });

  return NextResponse.json({
    message: "Upload PDF thành công.",
    url: `/api/catalog/file/${fileId}?name=${encodeURIComponent(file.name)}`,
  });
}

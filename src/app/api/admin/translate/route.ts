import { NextResponse } from "next/server";
import { z } from "zod";
import { hasAdminRole } from "@/lib/admin-auth";
import { translateViToEn } from "@/lib/google-translate";

const translateSchema = z.object({
  text: z.string(),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await hasAdminRole(["admin", "manager"]))) {
    return NextResponse.json({ message: "Bạn không có quyền thực hiện thao tác này." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = translateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  try {
    const result = await translateViToEn(parsed.data.text);
    return NextResponse.json({ text: result.text });
  } catch {
    return NextResponse.json(
      { message: "Chưa thể dịch tự động lúc này. Bạn thử lại sau nhé." },
      { status: 502 },
    );
  }
}

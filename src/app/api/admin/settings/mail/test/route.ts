import { NextResponse } from "next/server";
import { z } from "zod";
import { hasAdminRole } from "@/lib/admin-auth";
import { sendTestEmail } from "@/lib/mailer";

const schema = z.object({
  to: z.string().trim().email().optional().or(z.literal("")),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await hasAdminRole(["admin"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Email test không hợp lệ." }, { status: 400 });
  }

  try {
    const result = await sendTestEmail(parsed.data.to || undefined);

    if (result.status !== "sent") {
      return NextResponse.json(
        { message: "Chưa có cấu hình email hợp lệ để gửi test." },
        { status: 503 },
      );
    }

    return NextResponse.json({
      message: `Đã gửi email test qua ${result.provider?.toUpperCase() || "MAIL"}.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: `Gửi email test thất bại: ${error instanceof Error ? error.message : "Không xác định"}`,
      },
      { status: 502 },
    );
  }
}

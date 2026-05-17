import { NextResponse } from "next/server";
import { z } from "zod";
import { hasAdminRole } from "@/lib/admin-auth";
import {
  getMailSettings,
  saveMailSettings,
} from "@/lib/admin-settings-repository";

const mailSettingsSchema = z.object({
  mailFrom: z.string().trim().email(),
  mailTo: z.string().trim().email(),
  provider: z.enum(["resend", "smtp"]),
  resendApiKey: z.string().trim().optional().or(z.literal("")),
  smtpHost: z.string().trim().optional().or(z.literal("")),
  smtpPass: z.string().trim().optional().or(z.literal("")),
  smtpPort: z.number().int().positive().optional(),
  smtpSecure: z.boolean().optional(),
  smtpUser: z.string().trim().optional().or(z.literal("")),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await hasAdminRole(["admin"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const settings = await getMailSettings();
  return NextResponse.json({ settings });
}

export async function POST(request: Request) {
  if (!(await hasAdminRole(["admin"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = mailSettingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dữ liệu mail settings không hợp lệ." },
      { status: 400 },
    );
  }

  await saveMailSettings({
    ...parsed.data,
    resendApiKey: parsed.data.resendApiKey || undefined,
    smtpHost: parsed.data.smtpHost || undefined,
    smtpPass: parsed.data.smtpPass || undefined,
    smtpUser: parsed.data.smtpUser || undefined,
  });

  return NextResponse.json({ message: "Đã cập nhật cấu hình email." });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  isAdminConfigured,
  normalizeRedirectPath,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

const loginSchema = z.object({
  password: z.string().min(1),
  redirectTo: z.string().optional(),
  username: z.string().trim().min(1),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        message: "Thông tin đăng nhập quản trị chưa được cấu hình.",
      },
      { status: 500 },
    );
  }

  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Vui lòng nhập đầy đủ tài khoản và mật khẩu.",
      },
      { status: 400 },
    );
  }

  if (!verifyAdminCredentials(parsed.data.username, parsed.data.password)) {
    return NextResponse.json(
      {
        message: "Thông tin đăng nhập không chính xác.",
      },
      { status: 401 },
    );
  }

  const redirectTo = normalizeRedirectPath(parsed.data.redirectTo);
  const response = NextResponse.json({
    message: "Đăng nhập thành công.",
    redirectTo,
  });

  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionToken(parsed.data.username),
    getAdminSessionCookieOptions(),
  );

  return response;
}
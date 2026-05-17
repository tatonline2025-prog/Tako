import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionCookieOptions,
  normalizeRedirectPath,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const redirectTo = normalizeRedirectPath(
    String(formData.get("redirectTo") || "/dang-nhap"),
    "/dang-nhap",
  );
  const response = NextResponse.redirect(new URL(redirectTo, request.url), 303);

  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });

  return response;
}
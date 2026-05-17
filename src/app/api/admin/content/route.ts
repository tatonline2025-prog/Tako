import { NextResponse } from "next/server";
import { z } from "zod";
import { hasAdminRole } from "@/lib/admin-auth";
import {
  getAboutContent,
  getHomeContent,
  saveAboutContent,
  saveHomeContent,
} from "@/lib/site-content-repository";

const localizedTextSchema = z.object({
  en: z.string().trim().min(1),
  vi: z.string().trim().min(1),
});

const homeSchema = z.object({
  eyebrow: localizedTextSchema,
  featuredProductsTitle: localizedTextSchema,
  heroDesc: localizedTextSchema,
  newsTitle: localizedTextSchema,
  subhead: localizedTextSchema,
});

const aboutSchema = z.object({
  capabilityDesc: localizedTextSchema,
  capabilityTitle: localizedTextSchema,
  h1: localizedTextSchema,
  intro1: localizedTextSchema,
  intro2: localizedTextSchema,
  missionText: localizedTextSchema,
  visionText: localizedTextSchema,
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await hasAdminRole(["admin", "manager"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope");

  if (scope === "home") {
    return NextResponse.json({ scope, value: await getHomeContent() });
  }

  if (scope === "about") {
    return NextResponse.json({ scope, value: await getAboutContent() });
  }

  return NextResponse.json({ message: "scope không hợp lệ." }, { status: 400 });
}

export async function POST(request: Request) {
  if (!(await hasAdminRole(["admin", "manager"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const scope = body?.scope as string | undefined;

  if (scope === "home") {
    const parsed = homeSchema.safeParse(body.value);
    if (!parsed.success) {
      return NextResponse.json({ message: "Dữ liệu home không hợp lệ." }, { status: 400 });
    }

    await saveHomeContent(parsed.data);
    return NextResponse.json({ message: "Đã lưu nội dung trang chủ." });
  }

  if (scope === "about") {
    const parsed = aboutSchema.safeParse(body.value);
    if (!parsed.success) {
      return NextResponse.json({ message: "Dữ liệu about không hợp lệ." }, { status: 400 });
    }

    await saveAboutContent(parsed.data);
    return NextResponse.json({ message: "Đã lưu nội dung trang giới thiệu." });
  }

  return NextResponse.json({ message: "scope không hợp lệ." }, { status: 400 });
}

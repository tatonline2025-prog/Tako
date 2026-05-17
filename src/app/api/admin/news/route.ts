import { NextResponse } from "next/server";
import { z } from "zod";
import { hasAdminRole } from "@/lib/admin-auth";
import { translateViToEn } from "@/lib/google-translate";
import {
  deleteNewsArticle,
  listNewsArticles,
  upsertNewsArticle,
} from "@/lib/catalog-repository";

const localizedTextSchema = z.object({
  en: z.string().trim().optional().default(""),
  vi: z.string().trim().min(1),
});

const newsSchema = z.object({
  content: localizedTextSchema,
  date: z.string().trim().min(1),
  excerpt: localizedTextSchema,
  slug: z.string().trim().min(1),
  tag: z.string().trim().min(1),
  title: localizedTextSchema,
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await hasAdminRole(["admin", "manager"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const articles = await listNewsArticles();
  return NextResponse.json({ articles });
}

export async function POST(request: Request) {
  if (!(await hasAdminRole(["admin", "manager"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = newsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dữ liệu bài viết không hợp lệ." },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const titleEn = payload.title.en || (await translateViToEn(payload.title.vi)).text;
  const excerptEn = payload.excerpt.en || (await translateViToEn(payload.excerpt.vi)).text;
  const contentEn = payload.content.en || (await translateViToEn(payload.content.vi)).text;

  await upsertNewsArticle({
    ...payload,
    content: {
      en: contentEn,
      vi: payload.content.vi,
    },
    excerpt: {
      en: excerptEn,
      vi: payload.excerpt.vi,
    },
    title: {
      en: titleEn,
      vi: payload.title.vi,
    },
  });
  return NextResponse.json({ message: "Đã lưu bài viết." });
}

export async function DELETE(request: Request) {
  if (!(await hasAdminRole(["admin", "manager"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { message: "Thiếu slug bài viết." },
      { status: 400 },
    );
  }

  await deleteNewsArticle(slug);
  return NextResponse.json({ message: "Đã xóa bài viết." });
}

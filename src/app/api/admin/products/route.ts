import { NextResponse } from "next/server";
import { z } from "zod";
import { hasAdminRole } from "@/lib/admin-auth";
import {
  deleteProduct,
  listProducts,
  upsertProduct,
} from "@/lib/catalog-repository";

const localizedTextSchema = z.object({
  en: z.string().trim().min(1),
  vi: z.string().trim().min(1),
});

const productSchema = z.object({
  applications: z.array(z.string().trim().min(1)).default([]),
  category: z.string().trim().min(1),
  categoryName: localizedTextSchema,
  description: localizedTextSchema,
  featured: z.boolean().default(false),
  highlights: z.array(localizedTextSchema).default([]),
  imageLabel: z.string().trim().min(1),
  imageTone: z.string().trim().min(1),
  manufacturer: z.string().trim().min(1),
  name: localizedTextSchema,
  pdfPath: z.string().trim().min(1),
  shortDescription: localizedTextSchema,
  slug: z.string().trim().min(1),
  subcategory: z.string().trim().min(1),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await hasAdminRole(["admin", "manager"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const products = await listProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  if (!(await hasAdminRole(["admin", "manager"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dữ liệu sản phẩm không hợp lệ." },
      { status: 400 },
    );
  }

  await upsertProduct(parsed.data);
  return NextResponse.json({ message: "Đã lưu sản phẩm." });
}

export async function DELETE(request: Request) {
  if (!(await hasAdminRole(["admin", "manager"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { message: "Thiếu slug sản phẩm." },
      { status: 400 },
    );
  }

  await deleteProduct(slug);
  return NextResponse.json({ message: "Đã xóa sản phẩm." });
}

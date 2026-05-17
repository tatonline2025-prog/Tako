import { NextResponse } from "next/server";
import { z } from "zod";
import { hasAdminRole } from "@/lib/admin-auth";
import {
  deleteContact,
  deleteContacts,
  listContacts,
  updateContact,
} from "@/lib/contact-repository";

const updateSchema = z.object({
  id: z.string().trim().min(1),
  fullName: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().min(3).optional(),
  company: z.string().trim().min(1).optional(),
  interest: z.string().trim().min(1).optional(),
  message: z.string().trim().min(1).optional(),
  status: z.enum(["new", "handled"]).optional(),
});

const bulkDeleteSchema = z.object({
  ids: z.array(z.string().trim().min(1)).min(1),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await hasAdminRole(["admin", "manager"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const contacts = await listContacts(1000);
  return NextResponse.json({ contacts });
}

export async function PATCH(request: Request) {
  if (!(await hasAdminRole(["admin", "manager"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dữ liệu liên hệ không hợp lệ.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { id, ...payload } = parsed.data;
  await updateContact(id, payload);

  return NextResponse.json({ message: "Đã cập nhật liên hệ." });
}

export async function DELETE(request: Request) {
  if (!(await hasAdminRole(["admin", "manager"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (body) {
    const parsedBulk = bulkDeleteSchema.safeParse(body);
    if (parsedBulk.success) {
      await deleteContacts(parsedBulk.data.ids);
      return NextResponse.json({ message: "Đã xóa các liên hệ đã chọn." });
    }
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Thiếu id liên hệ." }, { status: 400 });
  }

  await deleteContact(id);
  return NextResponse.json({ message: "Đã xóa liên hệ." });
}

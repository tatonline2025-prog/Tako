import { NextResponse } from "next/server";
import { z } from "zod";
import { hasAdminRole } from "@/lib/admin-auth";
import {
  createAdminUser,
  deleteAdminUser,
  listAdminUsers,
  updateAdminUser,
} from "@/lib/admin-users-repository";

const createSchema = z.object({
  password: z.string().trim().min(4),
  role: z.enum(["admin", "manager"]),
  username: z.string().trim().min(3),
});

const updateSchema = z.object({
  id: z.string().trim().min(1),
  password: z.string().trim().optional().default(""),
  role: z.enum(["admin", "manager"]),
  username: z.string().trim().min(3),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await hasAdminRole(["admin"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const users = await listAdminUsers();
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  if (!(await hasAdminRole(["admin"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Dữ liệu người dùng không hợp lệ." }, { status: 400 });
  }

  try {
    await createAdminUser(parsed.data);
    return NextResponse.json({ message: "Đã thêm người dùng." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Không thể thêm người dùng." }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  if (!(await hasAdminRole(["admin"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Dữ liệu cập nhật không hợp lệ." }, { status: 400 });
  }

  try {
    await updateAdminUser(parsed.data.id, {
      password: parsed.data.password || undefined,
      role: parsed.data.role,
      username: parsed.data.username,
    });
    return NextResponse.json({ message: "Đã cập nhật người dùng." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Không thể cập nhật người dùng." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await hasAdminRole(["admin"]))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Thiếu id người dùng." }, { status: 400 });
  }

  try {
    await deleteAdminUser(id);
    return NextResponse.json({ message: "Đã xóa người dùng." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Không thể xóa người dùng." }, { status: 400 });
  }
}

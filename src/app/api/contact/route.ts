import { NextResponse } from "next/server";
import { contactSubmissionSchema } from "@/lib/contact-schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createContact, listContacts } from "@/lib/contact-repository";
import { sendContactNotification } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      {
        message: "Bạn cần đăng nhập quản trị để xem dữ liệu này.",
      },
      { status: 401 },
    );
  }

  try {
    const contacts = await listContacts();
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("[api/contact][GET] Failed to list contacts", error);
    return NextResponse.json(
      {
        message: "Không thể tải danh sách liên hệ lúc này.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Dữ liệu gửi lên không hợp lệ.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const contactId = await createContact(parsed.data);
    let notificationStatus: "sent" | "skipped" | "failed" = "skipped";

    try {
      const notification = await sendContactNotification(parsed.data);
      notificationStatus = notification.status;
    } catch {
      notificationStatus = "failed";
    }

    return NextResponse.json(
      {
        id: contactId,
        message: "TAKO Vietnam đã nhận yêu cầu. Chúng tôi sẽ liên hệ sớm.",
        notificationStatus,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/contact][POST] Failed to create contact", error);
    return NextResponse.json(
      {
        message: "Không thể lưu yêu cầu vào hệ thống lúc này.",
      },
      { status: 500 },
    );
  }
}
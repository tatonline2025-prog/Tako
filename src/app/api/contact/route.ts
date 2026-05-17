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
        message: "Ban can dang nhap quan tri de xem du lieu nay.",
      },
      { status: 401 },
    );
  }

  try {
    const contacts = await listContacts();
    return NextResponse.json({ contacts });
  } catch {
    return NextResponse.json(
      {
        message: "Khong the tai danh sach lien he luc nay.",
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
          message: "Du lieu gui len khong hop le.",
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
        message: "TAKO Vietnam da nhan yeu cau. Chung toi se lien he som.",
        notificationStatus,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        message: "Khong the luu yeu cau vao he thong luc nay.",
      },
      { status: 500 },
    );
  }
}
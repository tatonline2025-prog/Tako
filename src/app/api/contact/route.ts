import { NextResponse } from "next/server";
import { contactSubmissionSchema } from "@/lib/contact-schema";
import { createContact } from "@/lib/contact-repository";
import { sendContactNotification } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      message: "Đường dẫn này chỉ nhận yêu cầu gửi từ form liên hệ.",
    },
    { status: 405 },
  );
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

    try {
      const contactId = await createContact(parsed.data);
      const notification = await sendContactNotification(parsed.data);

      if (notification.status !== "sent") {
        return NextResponse.json(
          {
            contactId,
            message: "Yêu cầu đã được lưu vào CRM. Hiện hộp thư chưa sẵn sàng, vui lòng kiểm tra cấu hình email.",
          },
          { status: 503 },
        );
      }

      return NextResponse.json(
        {
          contactId,
          message: "TAKO Vietnam đã nhận yêu cầu của bạn và sẽ phản hồi sớm qua email.",
        },
        { status: 201 },
      );
    } catch (error) {
      return NextResponse.json(
        {
          message: `Yêu cầu đã lưu CRM nhưng gửi email thất bại: ${error instanceof Error ? error.message : "unknown error"}`,
        },
        { status: 503 },
      );
    }
  } catch (error) {
    console.error("[api/contact][POST] Failed to create contact", error);
    return NextResponse.json(
      {
        message: "Hiện chưa thể gửi yêu cầu. Bạn vui lòng thử lại sau.",
      },
      { status: 500 },
    );
  }
}
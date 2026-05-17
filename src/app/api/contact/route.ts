import { NextResponse } from "next/server";
import { contactSubmissionSchema } from "@/lib/contact-schema";
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
      const notification = await sendContactNotification(parsed.data);

      if (notification.status !== "sent") {
        return NextResponse.json(
          {
            message: "Hiện hộp thư chưa sẵn sàng. Bạn vui lòng thử lại sau ít phút nhé.",
          },
          { status: 503 },
        );
      }

      return NextResponse.json(
        {
          message: "TAKO Vietnam đã nhận yêu cầu của bạn và sẽ phản hồi sớm qua email.",
        },
        { status: 201 },
      );
    } catch {
      return NextResponse.json(
        {
          message: "Hiện tại hộp thư đang bận. Bạn vui lòng gửi lại sau ít phút.",
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
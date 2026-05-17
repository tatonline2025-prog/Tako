import { NextResponse } from "next/server";
import { z } from "zod";
import {
  isLocale,
  localeCookieName,
  type Locale,
} from "@/lib/i18n";

const localeSchema = z.object({
  locale: z.string(),
  redirectTo: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = localeSchema.safeParse(body);

  if (!parsed.success || !isLocale(parsed.data.locale)) {
    return NextResponse.json(
      {
        message: "Invalid locale.",
      },
      { status: 400 },
    );
  }

  const locale = parsed.data.locale as Locale;
  const response = NextResponse.json({ locale });

  response.cookies.set(localeCookieName, locale, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
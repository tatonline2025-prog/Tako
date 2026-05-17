export const localeCookieName = "tako_locale";
export const supportedLocales = ["vi", "en"] as const;

export type Locale = (typeof supportedLocales)[number];
export type LocalizedText = Record<Locale, string>;

export const chromeCopy = {
  contact: {
    en: "Contact",
    vi: "Liên hệ",
  },
  copyright: {
    en: "Privacy policy is being updated.",
    vi: "Chính sách bảo mật đang được cập nhật.",
  },
  cta: {
    en: "Request a Quote",
    vi: "Liên hệ báo giá",
  },
  footerDescription: {
    en: "A B2B catalog website for biotechnology equipment, reagents, consumables, molecular biomedicine, and clinical diagnostics solutions.",
    vi: "Danh mục B2B cho thiết bị, sinh phẩm, vật tư tiêu hao và giải pháp công nghệ sinh học, y sinh phân tử, chẩn đoán lâm sàng.",
  },
  language: {
    en: "Language",
    vi: "Ngôn ngữ",
  },
  partnerTagline: {
    en: "Biotechnology systems partner",
    vi: "Đối tác giải pháp công nghệ sinh học",
  },
  quickLinks: {
    en: "Quick Links",
    vi: "Liên kết nhanh",
  },
  zaloChat: {
    en: "Zalo chat",
    vi: "Chat Zalo",
  },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export async function getRequestLocale(): Promise<Locale> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const locale = cookieStore.get(localeCookieName)?.value;

  return isLocale(locale) ? locale : "vi";
}

export function localizeText(value: LocalizedText, locale: Locale) {
  return value[locale];
}
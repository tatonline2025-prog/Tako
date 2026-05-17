type TranslateResult = {
  text: string;
};

export async function translateViToEn(text: string): Promise<TranslateResult> {
  const input = text.trim();
  if (!input) {
    return { text: "" };
  }

  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&q=${encodeURIComponent(input)}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Translate request failed.");
  }

  const payload = (await response.json()) as unknown;
  const chunks = Array.isArray(payload) && Array.isArray(payload[0])
    ? (payload[0] as unknown[])
    : [];

  const translated = chunks
    .map((chunk) => (Array.isArray(chunk) ? chunk[0] : ""))
    .filter((value): value is string => typeof value === "string")
    .join("")
    .trim();

  return {
    text: translated || input,
  };
}

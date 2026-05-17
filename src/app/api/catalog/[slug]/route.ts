import { Buffer } from "node:buffer";
import { getProductBySlug } from "@/lib/catalog-repository";

export const runtime = "nodejs";

function escapePdf(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdfDocument(lines: string[]) {
  const streamLines = [
    "BT",
    "/F1 18 Tf",
    "50 780 Td",
    ...lines.flatMap((line, index) => {
      if (index === 0) {
        return [`(${escapePdf(line)}) Tj`];
      }

      return ["0 -26 Td", `(${escapePdf(line)}) Tj`];
    }),
    "ET",
  ];
  const stream = streamLines.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  const header = "%PDF-1.4\n";
  let body = "";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(header.length + body.length);
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = header.length + body.length;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;

  offsets.slice(1).forEach((offset) => {
    xref += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return `${header}${body}${xref}${trailer}`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return new Response("Not found", { status: 404 });
  }

  const pdfContent = buildPdfDocument([
    product.name.en,
    `Hang san xuat: ${product.manufacturer}`,
    `Linh vuc: ${product.categoryName.en}`,
    `Danh muc: ${product.subcategory}`,
    product.shortDescription.en,
    "Tai lieu PDF placeholder. Se duoc thay bang catalog chinh thuc khi TAKO cung cap file thuc te.",
  ]);

  return new Response(Buffer.from(pdfContent, "utf-8"), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
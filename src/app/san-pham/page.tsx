import type { Metadata } from "next";
import {
  allApplications,
  allManufacturers,
  categories,
  products,
} from "@/data/site";
import { ProductCatalog } from "@/components/product-catalog";
import { getRequestLocale, localizeText } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Sản phẩm / Giải pháp",
  description:
    "Tra cứu danh mục sản phẩm, lọc theo lĩnh vực, hãng sản xuất và ứng dụng, tải tài liệu kỹ thuật và liên hệ báo giá.",
};

export default async function ProductsPage() {
  const locale = await getRequestLocale();

  return (
    <div className="section-shell py-12 sm:py-16">
      <section className="space-y-4 pb-10">
        <span className="eyebrow">{localizeText({ en: "Products / Solutions", vi: "Sản phẩm / Giải pháp" }, locale)}</span>
        <h1 className="section-title">{localizeText({ en: "A catalog organized in tiered structure with ready-to-use search and filters", vi: "Danh mục được tổ chức theo cấu trúc cấp 1, cấp 2 và có sẵn công cụ filter tìm kiếm" }, locale)}</h1>
        <p className="section-copy">
          {localizeText({ en: "Each product includes a short overview, detailed description, placeholder PDF, and quotation CTA. The structure is ready to connect with a real management system later.", vi: "Mỗi sản phẩm đều có mô tả ngắn, mô tả chi tiết, tài liệu PDF placeholder và nút liên hệ báo giá. Cấu trúc này sẵn sàng để kết nối với hệ quản trị thực tế sau này." }, locale)}
        </p>
      </section>

      <ProductCatalog
        locale={locale}
        categories={categories}
        manufacturers={allManufacturers}
        applications={allApplications}
        products={products}
      />
    </div>
  );
}
import type { Metadata } from "next";
import {
  categories,
} from "@/data/site";
import { ProductCatalog } from "@/components/product-catalog";
import { listProducts } from "@/lib/catalog-repository";
import { getRequestLocale, localizeText } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Sản phẩm / Giải pháp",
  description:
    "Tra cứu danh mục sản phẩm, lọc theo lĩnh vực, hãng sản xuất và ứng dụng, tải tài liệu kỹ thuật và liên hệ báo giá.",
};

export default async function ProductsPage() {
  const locale = await getRequestLocale();
  const products = await listProducts();
  const manufacturers = Array.from(
    new Set(products.map((product) => product.manufacturer)),
  );
  const applications = Array.from(
    new Set(products.flatMap((product) => product.applications)),
  );

  return (
    <div className="section-shell py-12 sm:py-16">
      <section className="space-y-4 pb-10">
        <span className="eyebrow">{localizeText({ en: "Products / Solutions", vi: "Sản phẩm / Giải pháp" }, locale)}</span>
        <h1 className="section-title">{localizeText({ en: "Product catalog organized by technology field, manufacturer and application", vi: "Danh mục sản phẩm được tổ chức theo lĩnh vực, hãng sản xuất và ứng dụng" }, locale)}</h1>
        <p className="section-copy">
          {localizeText({ en: "Each product includes technical overview, detailed description, downloadable documents, and a direct quotation request link.", vi: "Mỗi sản phẩm bao gồm mô tả kỹ thuật, tài liệu tải xuống và liên kết gửi yêu cầu báo giá trực tiếp." }, locale)}
        </p>
      </section>

      <ProductCatalog
        locale={locale}
        categories={categories}
        manufacturers={manufacturers}
        applications={applications}
        products={products}
      />
    </div>
  );
}
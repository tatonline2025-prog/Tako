import type { Metadata } from "next";
import {
  categories,
} from "@/data/site";
import { ProductCatalog } from "@/components/product-catalog";
import {
  listProductFilterOptions,
  listProductsFilteredPage,
} from "@/lib/catalog-repository";
import { getRequestLocale, localizeText } from "@/lib/i18n";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Sản phẩm / Giải pháp",
  description:
    "Tra cứu danh mục sản phẩm, lọc theo lĩnh vực, hãng sản xuất và ứng dụng, tải tài liệu kỹ thuật và liên hệ báo giá.",
};

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    manufacturer?: string | string[];
    application?: string | string[];
    page?: string | string[];
  }>;
};

function asSingle(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const locale = await getRequestLocale();
  const query = await searchParams;

  const q = asSingle(query.q) || "";
  const category = asSingle(query.category) || "all";
  const manufacturer = asSingle(query.manufacturer) || "all";
  const application = asSingle(query.application) || "all";
  const rawPage = Number(asSingle(query.page) || "1");
  const page = Number.isFinite(rawPage) ? Math.max(1, rawPage) : 1;

  const [{ items, totalItems, totalPages }, { manufacturers, applications }] = await Promise.all([
    listProductsFilteredPage({ query: q, category, manufacturer, application }, page, 10),
    listProductFilterOptions(),
  ]);

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
        key={`${q}|${category}|${manufacturer}|${application}|${page}`}
        locale={locale}
        categories={categories}
        manufacturers={manufacturers}
        applications={applications}
        products={items}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        filters={{
          q,
          category,
          manufacturer,
          application,
        }}
      />
    </div>
  );
}
import type { Metadata } from "next";
import {
  allApplications,
  allManufacturers,
  categories,
  products,
} from "@/data/site";
import { ProductCatalog } from "@/components/product-catalog";

export const metadata: Metadata = {
  title: "San pham / Giai phap",
  description:
    "Tra cuu danh muc san pham, loc theo linh vuc, hang san xuat va ung dung, tai tai lieu ky thuat va lien he bao gia.",
};

export default function ProductsPage() {
  return (
    <div className="section-shell py-12 sm:py-16">
      <section className="space-y-4 pb-10">
        <span className="eyebrow">San pham / Giai phap</span>
        <h1 className="section-title">Danh muc duoc to chuc theo cau truc cap 1, cap 2 va co san cong cu filter tim kiem</h1>
        <p className="section-copy">
          Moi san pham deu co mo ta ngan, mo ta chi tiet, tai lieu PDF placeholder va
          nut lien he bao gia. Cau truc nay san sang de ket noi voi he quan tri thuc te sau nay.
        </p>
      </section>

      <ProductCatalog
        categories={categories}
        manufacturers={allManufacturers}
        applications={allApplications}
        products={products}
      />
    </div>
  );
}
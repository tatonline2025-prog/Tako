"use client";

import { useMemo, useState, useTransition } from "react";
import type { Category, Product } from "@/data/site";

type AdminProductManagerProps = {
  categories: Category[];
  initialProducts: Product[];
};

function templateProduct(): Product {
  return {
    applications: [],
    category: "proteomics",
    categoryName: { en: "Proteomics", vi: "Proteomics" },
    description: { en: "", vi: "" },
    featured: false,
    highlights: [{ en: "", vi: "" }],
    imageLabel: "New product",
    imageTone: "from-blue-600 to-cyan-400",
    manufacturer: "",
    name: { en: "", vi: "" },
    pdfPath: "/api/catalog/new-product",
    shortDescription: { en: "", vi: "" },
    slug: "new-product",
    subcategory: "",
  };
}

export function AdminProductManager({ categories, initialProducts }: AdminProductManagerProps) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedSlug, setSelectedSlug] = useState(initialProducts[0]?.slug || "");
  const [editorText, setEditorText] = useState(
    JSON.stringify(initialProducts[0] || templateProduct(), null, 2),
  );
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedProduct = useMemo(
    () => products.find((item) => item.slug === selectedSlug) || null,
    [products, selectedSlug],
  );

  function loadProduct(product: Product) {
    setSelectedSlug(product.slug);
    setEditorText(JSON.stringify(product, null, 2));
    setFeedback("");
  }

  function startNewProduct() {
    const fresh = templateProduct();
    setSelectedSlug("");
    setEditorText(JSON.stringify(fresh, null, 2));
    setFeedback("Đang tạo sản phẩm mới.");
  }

  function saveProduct() {
    startTransition(async () => {
      try {
        const parsed = JSON.parse(editorText) as Product;
        const response = await fetch("/api/admin/products", {
          body: JSON.stringify(parsed),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        const payload = (await response.json()) as { message?: string };

        if (!response.ok) {
          setFeedback(payload.message || "Lưu sản phẩm thất bại.");
          return;
        }

        const exists = products.some((item) => item.slug === parsed.slug);
        const next = exists
          ? products.map((item) => (item.slug === parsed.slug ? parsed : item))
          : [parsed, ...products];
        setProducts(next);
        setSelectedSlug(parsed.slug);
        setEditorText(JSON.stringify(parsed, null, 2));
        setFeedback("Đã lưu sản phẩm thành công.");
      } catch {
        setFeedback("JSON không hợp lệ. Vui lòng kiểm tra lại dấu ngoặc và định dạng.");
      }
    });
  }

  function removeProduct(slug: string) {
    if (!confirm(`Xóa sản phẩm ${slug}?`)) {
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/admin/products?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setFeedback(payload.message || "Xóa sản phẩm thất bại.");
        return;
      }

      const next = products.filter((item) => item.slug !== slug);
      setProducts(next);
      if (selectedSlug === slug) {
        const fallback = next[0] || templateProduct();
        setSelectedSlug(next[0]?.slug || "");
        setEditorText(JSON.stringify(fallback, null, 2));
      }
      setFeedback("Đã xóa sản phẩm.");
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Danh sách sản phẩm</h2>
            <p className="text-xs text-gray-500">{products.length} sản phẩm</p>
          </div>
          <button
            type="button"
            onClick={startNewProduct}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            + Tạo mới
          </button>
        </div>

        <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
          {products.map((product) => (
            <div
              key={product.slug}
              className={`rounded-xl border px-3 py-3 ${selectedSlug === product.slug ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white"}`}
            >
              <button type="button" onClick={() => loadProduct(product)} className="w-full text-left">
                <div className="text-sm font-medium text-gray-900">{product.name.vi}</div>
                <div className="mt-1 text-xs text-gray-500">{product.slug}</div>
              </button>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>{product.manufacturer}</span>
                <button
                  type="button"
                  onClick={() => removeProduct(product.slug)}
                  className="font-medium text-red-600 hover:underline"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Text editor (JSON)</h2>
          <button
            type="button"
            onClick={saveProduct}
            disabled={isPending}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {isPending ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </div>

        <div className="mb-3 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
          Gợi ý fields bắt buộc: <span className="font-mono">slug, name.en, name.vi, category, manufacturer, shortDescription, description, highlights, imageTone, pdfPath</span>
        </div>

        <textarea
          value={editorText}
          onChange={(event) => setEditorText(event.target.value)}
          spellCheck={false}
          className="h-[420px] w-full rounded-xl border border-gray-200 bg-[#0f172a] p-3 font-mono text-xs leading-6 text-slate-100 outline-none focus:border-blue-400"
        />

        <div className="mt-3 grid gap-2 text-xs text-gray-500 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 px-3 py-2">Danh mục có sẵn: {categories.map((item) => item.slug).join(", ")}</div>
          <div className="rounded-lg bg-gray-50 px-3 py-2">Đang sửa: {selectedProduct?.slug || "Sản phẩm mới"}</div>
        </div>

        {feedback ? <p className="mt-3 text-sm text-gray-700">{feedback}</p> : null}
      </div>
    </div>
  );
}

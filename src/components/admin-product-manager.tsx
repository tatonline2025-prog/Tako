"use client";

import { useMemo, useState, useTransition } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Pagination } from "./pagination";
import type { Category, Product } from "@/data/site";

type AdminProductManagerProps = {
  categories: Category[];
  initialProducts: Product[];
};

type LocaleField = "vi" | "en";

function templateProduct(): Product {
  return {
    applications: [],
    category: "proteomics",
    categoryName: { en: "Proteomics", vi: "Proteomics" },
    description: { en: "", vi: "" },
    featured: false,
    highlights: [{ en: "", vi: "" }],
    imageLabel: "",
    imageTone: "from-blue-600 to-cyan-400",
    manufacturer: "",
    name: { en: "", vi: "" },
    pdfPath: "/api/catalog/new-product",
    shortDescription: { en: "", vi: "" },
    slug: "new-product",
    subcategory: "",
  };
}

function normalizeProduct(product: Product) {
  return {
    ...product,
    applications: product.applications || [],
    highlights: product.highlights.length > 0 ? product.highlights : [{ en: "", vi: "" }],
  };
}

export function AdminProductManager({ categories, initialProducts }: AdminProductManagerProps) {
  const [products, setProducts] = useState(initialProducts.map(normalizeProduct));
  const [selectedSlug, setSelectedSlug] = useState(initialProducts[0]?.slug || "");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const itemsPerPage = 10;
  const [draft, setDraft] = useState<Product>(
    normalizeProduct(initialProducts[0] || templateProduct()),
  );
  const [activeLocale, setActiveLocale] = useState<LocaleField>("vi");
  const [applicationsText, setApplicationsText] = useState((initialProducts[0]?.applications || []).join(", "));
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedProduct = useMemo(
    () => products.find((item) => item.slug === selectedSlug) || null,
    [products, selectedSlug],
  );

  const filteredProducts = useMemo(
    () => products.filter((p) => p.slug.toLowerCase().includes(searchFilter.toLowerCase()) || p.name.vi.toLowerCase().includes(searchFilter.toLowerCase())),
    [products, searchFilter],
  );

  const paginatedProducts = useMemo(
    () => filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredProducts, currentPage],
  );

  function applyDraft(product: Product) {
    const normalized = normalizeProduct(product);
    setDraft(normalized);
    setApplicationsText(normalized.applications.join(", "));
  }

  function loadProduct(product: Product) {
    setSelectedSlug(product.slug);
    applyDraft(product);
    setIsEditorOpen(true);
    setFeedback("");
  }

  function startNewProduct() {
    setSelectedSlug("");
    applyDraft(templateProduct());
    setIsEditorOpen(true);
    setFeedback("Đang tạo sản phẩm mới.");
  }

  function updateDraft<K extends keyof Product>(field: K, value: Product[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function updateLocalized(
    field: "name" | "categoryName" | "shortDescription" | "description",
    locale: LocaleField,
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      [field]: {
        ...current[field],
        [locale]: value,
      },
    }));
  }

  function updateHighlight(index: number, locale: LocaleField, value: string) {
    setDraft((current) => ({
      ...current,
      highlights: current.highlights.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [locale]: value,
            }
          : item,
      ),
    }));
  }

  function addHighlight() {
    setDraft((current) => ({
      ...current,
      highlights: [...current.highlights, { en: "", vi: "" }],
    }));
  }

  function removeHighlight(index: number) {
    setDraft((current) => {
      if (current.highlights.length <= 1) {
        return current;
      }

      return {
        ...current,
        highlights: current.highlights.filter((_, itemIndex) => itemIndex !== index),
      };
    });
  }

  function buildPayload() {
    return {
      ...draft,
      applications: applicationsText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
  }

  function saveProduct() {
    startTransition(async () => {
      const payload = buildPayload();

      const response = await fetch("/api/admin/products", {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setFeedback(result.message || "Chưa thể lưu sản phẩm. Vui lòng kiểm tra lại nội dung.");
        return;
      }

      const exists = products.some((item) => item.slug === payload.slug);
      const next = exists
        ? products.map((item) => (item.slug === payload.slug ? normalizeProduct(payload) : item))
        : [normalizeProduct(payload), ...products];

      setProducts(next);
      setSelectedSlug(payload.slug);
      applyDraft(payload);
      setFeedback("Đã lưu sản phẩm.");
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
        setFeedback(payload.message || "Chưa thể xóa sản phẩm lúc này.");
        return;
      }

      const next = products.filter((item) => item.slug !== slug);
      setProducts(next);

      if (selectedSlug === slug) {
        const fallback = next[0] || templateProduct();
        setSelectedSlug(next[0]?.slug || "");
        applyDraft(fallback);
        setIsEditorOpen(false);
      }

      setFeedback("Đã xóa sản phẩm.");
    });
  }

  if (!isEditorOpen) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Danh sách sản phẩm ({filteredProducts.length})</h2>
            <p className="text-xs text-gray-500">Phân trang mỗi {itemsPerPage} sản phẩm</p>
          </div>
          <button
            type="button"
            onClick={startNewProduct}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            + Thêm mới
          </button>
        </div>

        <input
          type="text"
          value={searchFilter}
          onChange={(e) => {
            setSearchFilter(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Tìm kiếm slug hoặc tên..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mb-3"
        />

        <Pagination currentPage={currentPage} totalItems={filteredProducts.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />

        <div className="space-y-2 my-3">
          {paginatedProducts.map((product) => (
            <div
              key={product.slug}
              className="rounded-xl border border-gray-200 bg-white px-3 py-3"
            >
              <div className="text-sm font-semibold text-gray-900">{product.name.vi || "(Chưa đặt tên)"}</div>
              <div className="mt-1 text-xs text-gray-500">{product.slug}</div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>{product.manufacturer || "Chưa có hãng"}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => loadProduct(product)}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProduct(product.slug)}
                    className="font-semibold text-rose-600 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination currentPage={currentPage} totalItems={filteredProducts.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
        {feedback ? <p className="mt-4 text-sm text-gray-700">{feedback}</p> : null}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-gray-900">
            {selectedProduct ? `Đang sửa: ${selectedProduct.slug}` : "Sản phẩm mới"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="rounded-xl border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Quay lại danh sách
            </button>
            <button
              type="button"
              onClick={saveProduct}
              disabled={isPending}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {isPending ? "Đang lưu..." : "Lưu sản phẩm"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm text-gray-700">
            Slug
            <input
              value={draft.slug}
              onChange={(event) => updateDraft("slug", event.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-gray-700">
            Danh mục
            <select
              value={draft.category}
              onChange={(event) => {
                const slug = event.target.value;
                const matched = categories.find((item) => item.slug === slug);
                updateDraft("category", slug);
                if (matched) {
                  updateDraft("categoryName", { en: matched.name, vi: matched.name });
                }
              }}
              className="rounded-xl border border-gray-300 px-3 py-2"
            >
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm text-gray-700">
            Hãng sản xuất
            <input
              value={draft.manufacturer}
              onChange={(event) => updateDraft("manufacturer", event.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-gray-700">
            Danh mục cấp 2
            <input
              value={draft.subcategory}
              onChange={(event) => updateDraft("subcategory", event.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-gray-700">
            Nhãn ảnh (hero)
            <input
              value={draft.imageLabel}
              onChange={(event) => updateDraft("imageLabel", event.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-gray-700">
            Màu nền ảnh
            <input
              value={draft.imageTone}
              onChange={(event) => updateDraft("imageTone", event.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
              placeholder="from-blue-600 to-cyan-400"
            />
          </label>

          <label className="grid gap-1 text-sm text-gray-700 md:col-span-2">
            Link PDF
            <input
              value={draft.pdfPath}
              onChange={(event) => updateDraft("pdfPath", event.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-gray-700 md:col-span-2">
            Ứng dụng (ngăn cách bằng dấu phẩy)
            <input
              value={applicationsText}
              onChange={(event) => setApplicationsText(event.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
              placeholder="PCR, qPCR, NGS"
            />
          </label>

          <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 md:col-span-2">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(event) => updateDraft("featured", event.target.checked)}
              className="h-4 w-4"
            />
            Hiển thị ở nhóm sản phẩm nổi bật
          </label>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="flex gap-2">
            {(["vi", "en"] as LocaleField[]).map((locale) => (
              <button
                key={locale}
                type="button"
                onClick={() => setActiveLocale(locale)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                  activeLocale === locale
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {locale === "vi" ? "Tiếng Việt" : "English"}
              </button>
            ))}
          </div>

          <label className="grid gap-1 text-sm text-gray-700">
            Tên sản phẩm ({activeLocale.toUpperCase()})
            <input
              value={draft.name[activeLocale]}
              onChange={(event) => updateLocalized("name", activeLocale, event.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-gray-700">
            Tên danh mục ({activeLocale.toUpperCase()})
            <input
              value={draft.categoryName[activeLocale]}
              onChange={(event) => updateLocalized("categoryName", activeLocale, event.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
          </label>

          <RichTextEditor
            label={`Mô tả ngắn (${activeLocale.toUpperCase()})`}
            value={draft.shortDescription[activeLocale]}
            onChange={(next) => updateLocalized("shortDescription", activeLocale, next)}
            minHeight={140}
          />

          <RichTextEditor
            label={`Mô tả chi tiết (${activeLocale.toUpperCase()})`}
            value={draft.description[activeLocale]}
            onChange={(next) => updateLocalized("description", activeLocale, next)}
            minHeight={220}
          />

          <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Điểm nổi bật ({activeLocale.toUpperCase()})</h3>
              <button
                type="button"
                onClick={addHighlight}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-700"
              >
                + Thêm dòng
              </button>
            </div>
            {draft.highlights.map((item, index) => (
              <div key={`${index}-${item.vi.slice(0, 8)}`} className="space-y-2 rounded-xl border border-gray-200 bg-white p-3">
                <RichTextEditor
                  label={`Nội dung #${index + 1}`}
                  value={item[activeLocale]}
                  onChange={(next) => updateHighlight(index, activeLocale, next)}
                  minHeight={110}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    Xóa dòng
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Pagination currentPage={currentPage} totalItems={filteredProducts.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />

        {feedback ? <p className="mt-3 text-sm text-gray-700">{feedback}</p> : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import type { Category, Product } from "@/data/site";
import { localizeText, type Locale } from "@/lib/i18n";

type ProductCatalogProps = {
  locale?: Locale;
  categories: Category[];
  manufacturers: string[];
  applications: string[];
  products: Product[];
};

export function ProductCatalog({
  locale = "vi",
  categories,
  manufacturers,
  applications,
  products,
}: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [manufacturerFilter, setManufacturerFilter] = useState("all");
  const [applicationFilter, setApplicationFilter] = useState("all");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const normalizedQuery = deferredSearchTerm.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesManufacturer =
      manufacturerFilter === "all" || product.manufacturer === manufacturerFilter;
    const matchesApplication =
      applicationFilter === "all" || product.applications.includes(applicationFilter);
    const haystack = [
      product.name.en,
      product.name.vi,
      product.subcategory,
      product.shortDescription.en,
      product.shortDescription.vi,
      product.description.en,
      product.description.vi,
      product.manufacturer,
      ...product.applications,
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch = !normalizedQuery || haystack.includes(normalizedQuery);

    return (
      matchesCategory &&
      matchesManufacturer &&
      matchesApplication &&
      matchesSearch
    );
  });

  const copy = {
    allApplications: locale === "en" ? "All applications" : "Tất cả ứng dụng",
    allCategories: locale === "en" ? "All sectors" : "Tất cả lĩnh vực",
    allManufacturers: locale === "en" ? "All manufacturers" : "Tất cả hãng",
    application: locale === "en" ? "Application" : "Ứng dụng",
    category: locale === "en" ? "Sector" : "Lĩnh vực",
    details: locale === "en" ? "View details" : "Xem chi tiết",
    empty: locale === "en"
      ? "No products match the current filters. Try another keyword or reset the filters."
      : "Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại. Hãy đổi từ khóa hoặc đặt lại bộ lọc.",
    manufacturer: locale === "en" ? "Manufacturer" : "Hãng sản xuất",
    pdf: locale === "en" ? "Download PDF" : "Tải PDF",
    quote: locale === "en" ? "Request quote" : "Liên hệ báo giá",
    reset: locale === "en" ? "Reset filters" : "Đặt lại bộ lọc",
    results: locale === "en" ? "matching products found" : "sản phẩm phù hợp",
    search: locale === "en" ? "Search by name or keyword" : "Tìm theo tên hoặc từ khóa",
    searchPlaceholder: locale === "en" ? "e.g. MGI, sepsis, HLA, proteomics" : "VD: MGI, sepsis, HLA, proteomics",
  };

  return (
    <div className="space-y-8">
      <div className="panel grid gap-5 px-6 py-6 lg:grid-cols-[1.2fr_repeat(3,_0.6fr)] lg:px-8">
        <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
          {copy.search}
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={copy.searchPlaceholder}
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-primary)]"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
          {copy.category}
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-primary)]"
          >
            <option value="all">{copy.allCategories}</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
          {copy.manufacturer}
          <select
            value={manufacturerFilter}
            onChange={(event) => setManufacturerFilter(event.target.value)}
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-primary)]"
          >
            <option value="all">{copy.allManufacturers}</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer} value={manufacturer}>
                {manufacturer}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
          {copy.application}
          <select
            value={applicationFilter}
            onChange={(event) => setApplicationFilter(event.target.value)}
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-primary)]"
          >
            <option value="all">{copy.allApplications}</option>
            {applications.map((application) => (
              <option key={application} value={application}>
                {application}
              </option>
            ))}
          </select>
        </label>

        <div className="lg:col-span-4 flex items-center justify-between gap-4 rounded-[1.5rem] border border-[var(--color-line)] bg-[rgba(13,78,166,0.04)] px-4 py-4">
          <p className="text-sm leading-7 text-[var(--color-muted)]">
            Tìm thấy <strong className="text-[var(--color-ink)]">{filteredProducts.length}</strong> {copy.results}.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setManufacturerFilter("all");
              setApplicationFilter("all");
            }}
            className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-primary)]"
          >
            {copy.reset}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <article key={product.slug} className="panel overflow-hidden">
            <div className={`h-44 bg-gradient-to-br ${product.imageTone} p-6 text-white`}>
              <div className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em]">
                {product.manufacturer}
              </div>
              <div className="mt-8 font-[family:var(--font-display)] text-3xl font-semibold leading-tight">
                {product.imageLabel}
              </div>
            </div>

            <div className="space-y-4 px-6 py-6">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">
                  {localizeText(product.categoryName, locale)}
                </div>
                <h2 className="mt-2 font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
                  {localizeText(product.name, locale)}
                </h2>
              </div>

              <p className="text-sm leading-7 text-[var(--color-muted)]">
                {localizeText(product.shortDescription, locale)}
              </p>

              <div className="flex flex-wrap gap-2">
                {product.applications.slice(0, 3).map((application) => (
                  <span
                    key={application}
                    className="rounded-full bg-[rgba(13,78,166,0.08)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]"
                  >
                    {application}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href={`/san-pham/${product.slug}`}
                  className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                >
                  {copy.details}
                </Link>
                <Link
                  href={product.pdfPath}
                  className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
                >
                  {copy.pdf}
                </Link>
                <Link
                  href={`/lien-he?interest=${product.slug}`}
                  className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
                >
                  {copy.quote}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="panel px-6 py-10 text-center text-sm leading-7 text-[var(--color-muted)]">
          {copy.empty}
        </div>
      ) : null}
    </div>
  );
}
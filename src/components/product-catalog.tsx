"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RichContent } from "@/components/rich-content";
import type { Category, Product } from "@/data/site";
import { localizeText, type Locale } from "@/lib/i18n";

type ProductCatalogProps = {
  locale?: Locale;
  categories: Category[];
  manufacturers: string[];
  applications: string[];
  products: Product[];
  page: number;
  totalPages: number;
  totalItems: number;
  filters: {
    q: string;
    category: string;
    manufacturer: string;
    application: string;
  };
};

export function ProductCatalog({
  locale = "vi",
  categories,
  manufacturers,
  applications,
  products,
  page,
  totalPages,
  totalItems,
  filters,
}: ProductCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(filters.q);
  const [categoryFilter, setCategoryFilter] = useState(filters.category || "all");
  const [manufacturerFilter, setManufacturerFilter] = useState(filters.manufacturer || "all");
  const [applicationFilter, setApplicationFilter] = useState(filters.application || "all");

  const pushFilters = useCallback((next: {
    q?: string;
    category?: string;
    manufacturer?: string;
    application?: string;
    page?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    const upsert = (key: string, value?: string) => {
      if (!value || value === "all") {
        params.delete(key);
        return;
      }
      params.set(key, value);
    };

    upsert("q", next.q ?? searchTerm.trim());
    upsert("category", next.category ?? categoryFilter);
    upsert("manufacturer", next.manufacturer ?? manufacturerFilter);
    upsert("application", next.application ?? applicationFilter);

    if (next.page && next.page !== "1") {
      params.set("page", next.page);
    } else {
      params.delete("page");
    }

    const query = params.toString();

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }, [applicationFilter, categoryFilter, manufacturerFilter, pathname, router, searchParams, searchTerm]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm !== filters.q) {
        pushFilters({ q: searchTerm.trim(), page: "1" });
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [filters.q, pushFilters, searchTerm]);

  const pageLinks = useMemo(() => {
    const current = Math.max(1, Math.min(page, totalPages));
    const links: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, current + 2);

    for (let p = start; p <= end; p += 1) {
      links.push(p);
    }

    return links;
  }, [page, totalPages]);

  function buildPageHref(targetPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (targetPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(targetPage));
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

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
            onChange={(event) => {
              const next = event.target.value;
              setCategoryFilter(next);
              pushFilters({ category: next, page: "1" });
            }}
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
            onChange={(event) => {
              const next = event.target.value;
              setManufacturerFilter(next);
              pushFilters({ manufacturer: next, page: "1" });
            }}
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
            onChange={(event) => {
              const next = event.target.value;
              setApplicationFilter(next);
              pushFilters({ application: next, page: "1" });
            }}
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
            Tìm thấy <strong className="text-[var(--color-ink)]">{totalItems}</strong> {copy.results}.
          </p>
          <div className="flex items-center gap-3">
            {isPending ? <span className="text-xs font-semibold text-[var(--color-primary)]">Đang tải...</span> : null}
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setManufacturerFilter("all");
                setApplicationFilter("all");
                startTransition(() => {
                  router.replace(pathname, { scroll: false });
                });
              }}
              className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-primary)]"
            >
              {copy.reset}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.slug} className="panel modern-card overflow-hidden">
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

              <RichContent
                html={localizeText(product.shortDescription, locale)}
                className="text-sm text-[var(--color-muted)]"
              />

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
                  prefetch={false}
                  className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)]"
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
                  prefetch={false}
                  className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
                >
                  {copy.quote}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {totalItems > 0 ? (
        <div className="flex items-center justify-between rounded-[1.5rem] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-muted)]">
          <span>{locale === "en" ? "Page" : "Trang"} {Math.min(page, totalPages)}/{totalPages}</span>
          <div className="flex items-center gap-2">
            <Link
              href={buildPageHref(Math.max(1, page - 1))}
              prefetch={false}
              scroll={false}
              aria-disabled={page <= 1}
              className="rounded-full border border-[var(--color-line)] px-3 py-1.5 font-semibold text-[var(--color-ink)] disabled:opacity-45"
            >
              {locale === "en" ? "Previous" : "Trước"}
            </Link>

            {pageLinks.map((target) => (
              <Link
                key={target}
                href={buildPageHref(target)}
                prefetch={false}
                scroll={false}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  target === page
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-[var(--color-line)] text-[var(--color-ink)]"
                }`}
              >
                {target}
              </Link>
            ))}

            <Link
              href={buildPageHref(Math.min(totalPages, page + 1))}
              prefetch={false}
              scroll={false}
              aria-disabled={page >= totalPages}
              className="rounded-full border border-[var(--color-line)] px-3 py-1.5 font-semibold text-[var(--color-ink)] disabled:opacity-45"
            >
              {locale === "en" ? "Next" : "Sau"}
            </Link>
          </div>
        </div>
      ) : null}

      {totalItems === 0 ? (
        <div className="panel px-6 py-10 text-center text-sm leading-7 text-[var(--color-muted)]">
          {copy.empty}
        </div>
      ) : null}
    </div>
  );
}
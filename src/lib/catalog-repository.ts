import { ObjectId } from "mongodb";
import {
  categories,
  newsArticles as staticNewsArticles,
  products as staticProducts,
  type NewsArticle,
  type Product,
} from "@/data/site";
import { getMongoDatabase } from "@/lib/mongodb";

type ProductDocument = Product & {
  _id?: ObjectId;
  updatedAt: Date;
};

type NewsDocument = NewsArticle & {
  _id?: ObjectId;
  updatedAt: Date;
};

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

type ProductListFilters = {
  query?: string;
  category?: string;
  manufacturer?: string;
  application?: string;
};

function normalizeNewsArticle(article: NewsArticle): NewsArticle {
  return {
    ...article,
    content: article.content || article.excerpt,
    excerpt: article.excerpt || article.content || { en: "", vi: "" },
  };
}

function getStaticCategoryName(categorySlug: string) {
  return categories.find((item) => item.slug === categorySlug)?.name || categorySlug;
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    applications: product.applications || [],
    categoryName: product.categoryName || {
      en: getStaticCategoryName(product.category),
      vi: getStaticCategoryName(product.category),
    },
    description: product.description || {
      en: product.shortDescription?.en || "",
      vi: product.shortDescription?.vi || "",
    },
    featured: Boolean(product.featured),
    highlights: Array.isArray(product.highlights) ? product.highlights : [],
    imageLabel: product.imageLabel || product.name.vi,
    imageTone: product.imageTone || "from-blue-600 to-cyan-400",
    name: product.name || { en: "", vi: "" },
    shortDescription: product.shortDescription || { en: "", vi: "" },
  };
}

async function getProductsCollection() {
  const database = await getMongoDatabase();
  return database.collection<ProductDocument>("products");
}

async function getNewsCollection() {
  const database = await getMongoDatabase();
  return database.collection<NewsDocument>("news_articles");
}

export async function listProducts(limit?: number): Promise<Product[]> {
  try {
    const collection = await getProductsCollection();
    const query = collection.find({}, { sort: { featured: -1, updatedAt: -1 } });
    if (limit) {
      query.limit(limit);
    }
    const records = await query.toArray();

    if (records.length === 0) {
      return staticProducts.map(normalizeProduct);
    }

    return records.map((record) => {
      const { _id, updatedAt, ...product } = record;
      void _id;
      void updatedAt;
      return normalizeProduct(product);
    });
  } catch {
    return staticProducts.map(normalizeProduct);
  }
}

export async function listProductsPage(page = 1, pageSize = 10): Promise<PagedResult<Product>> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, Math.min(pageSize, 50));
  const skip = (safePage - 1) * safePageSize;

  try {
    const collection = await getProductsCollection();
    const [records, totalItems] = await Promise.all([
      collection
        .find({}, { sort: { featured: -1, updatedAt: -1 } })
        .skip(skip)
        .limit(safePageSize)
        .toArray(),
      collection.countDocuments(),
    ]);

    if (records.length === 0 && totalItems === 0) {
      const totalPages = Math.max(1, Math.ceil(staticProducts.length / safePageSize));
      return {
        items: staticProducts
          .map(normalizeProduct)
          .slice(skip, skip + safePageSize),
        page: safePage,
        pageSize: safePageSize,
        totalItems: staticProducts.length,
        totalPages,
      };
    }

    const items = records.map((record) => {
      const { _id, updatedAt, ...product } = record;
      void _id;
      void updatedAt;
      return normalizeProduct(product);
    });

    return {
      items,
      page: safePage,
      pageSize: safePageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / safePageSize)),
    };
  } catch {
    const normalized = staticProducts.map(normalizeProduct);
    const totalPages = Math.max(1, Math.ceil(normalized.length / safePageSize));
    return {
      items: normalized.slice(skip, skip + safePageSize),
      page: safePage,
      pageSize: safePageSize,
      totalItems: normalized.length,
      totalPages,
    };
  }
}

function filterStaticProducts(items: Product[], filters: ProductListFilters): Product[] {
  const normalizedQuery = (filters.query || "").trim().toLowerCase();

  return items.filter((product) => {
    const matchesCategory = !filters.category || filters.category === "all" || product.category === filters.category;
    const matchesManufacturer = !filters.manufacturer || filters.manufacturer === "all" || product.manufacturer === filters.manufacturer;
    const matchesApplication = !filters.application || filters.application === "all" || product.applications.includes(filters.application);

    if (!normalizedQuery) {
      return matchesCategory && matchesManufacturer && matchesApplication;
    }

    const haystack = [
      product.name.en,
      product.name.vi,
      product.subcategory,
      product.shortDescription.en,
      product.shortDescription.vi,
      product.manufacturer,
      ...product.applications,
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && matchesManufacturer && matchesApplication && haystack.includes(normalizedQuery);
  });
}

export async function listProductsFilteredPage(
  filters: ProductListFilters,
  page = 1,
  pageSize = 10,
): Promise<PagedResult<Product>> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, Math.min(pageSize, 50));
  const skip = (safePage - 1) * safePageSize;

  const query = (filters.query || "").trim();
  const category = filters.category && filters.category !== "all" ? filters.category : undefined;
  const manufacturer = filters.manufacturer && filters.manufacturer !== "all" ? filters.manufacturer : undefined;
  const application = filters.application && filters.application !== "all" ? filters.application : undefined;

  const mongoFilter: Record<string, unknown> = {};

  if (category) {
    mongoFilter.category = category;
  }
  if (manufacturer) {
    mongoFilter.manufacturer = manufacturer;
  }
  if (application) {
    mongoFilter.applications = application;
  }
  if (query) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    mongoFilter.$or = [
      { "name.en": { $regex: escaped, $options: "i" } },
      { "name.vi": { $regex: escaped, $options: "i" } },
      { subcategory: { $regex: escaped, $options: "i" } },
      { "shortDescription.en": { $regex: escaped, $options: "i" } },
      { "shortDescription.vi": { $regex: escaped, $options: "i" } },
      { manufacturer: { $regex: escaped, $options: "i" } },
      { applications: { $regex: escaped, $options: "i" } },
    ];
  }

  try {
    const collection = await getProductsCollection();
    const [records, totalItems] = await Promise.all([
      collection
        .find(mongoFilter, { sort: { featured: -1, updatedAt: -1 } })
        .skip(skip)
        .limit(safePageSize)
        .toArray(),
      collection.countDocuments(mongoFilter),
    ]);

    if (records.length === 0 && totalItems === 0) {
      const fallback = filterStaticProducts(staticProducts.map(normalizeProduct), {
        application,
        category,
        manufacturer,
        query,
      });
      return {
        items: fallback.slice(skip, skip + safePageSize),
        page: safePage,
        pageSize: safePageSize,
        totalItems: fallback.length,
        totalPages: Math.max(1, Math.ceil(fallback.length / safePageSize)),
      };
    }

    const items = records.map((record) => {
      const { _id, updatedAt, ...product } = record;
      void _id;
      void updatedAt;
      return normalizeProduct(product);
    });

    return {
      items,
      page: safePage,
      pageSize: safePageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / safePageSize)),
    };
  } catch {
    const fallback = filterStaticProducts(staticProducts.map(normalizeProduct), {
      application,
      category,
      manufacturer,
      query,
    });
    return {
      items: fallback.slice(skip, skip + safePageSize),
      page: safePage,
      pageSize: safePageSize,
      totalItems: fallback.length,
      totalPages: Math.max(1, Math.ceil(fallback.length / safePageSize)),
    };
  }
}

export async function listProductFilterOptions(): Promise<{ manufacturers: string[]; applications: string[] }> {
  try {
    const collection = await getProductsCollection();
    const [manufacturers, applications] = await Promise.all([
      collection.distinct("manufacturer"),
      collection.distinct("applications"),
    ]);

    return {
      manufacturers: manufacturers.filter(Boolean).sort((a, b) => a.localeCompare(b)),
      applications: applications.filter(Boolean).sort((a, b) => a.localeCompare(b)),
    };
  } catch {
    const fallback = staticProducts.map(normalizeProduct);
    return {
      manufacturers: Array.from(new Set(fallback.map((item) => item.manufacturer))).sort((a, b) => a.localeCompare(b)),
      applications: Array.from(new Set(fallback.flatMap((item) => item.applications))).sort((a, b) => a.localeCompare(b)),
    };
  }
}

export async function getProductCount(): Promise<number> {
  try {
    const collection = await getProductsCollection();
    return await collection.countDocuments();
  } catch {
    return staticProducts.length;
  }
}
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const collection = await getProductsCollection();
    const record = await collection.findOne({ slug });

    if (record) {
      const { _id, updatedAt, ...product } = record;
      void _id;
      void updatedAt;
      return normalizeProduct(product);
    }
  } catch {
    // Fall back to static data below.
  }

  const fallback = staticProducts.find((item) => item.slug === slug);
  return fallback ? normalizeProduct(fallback) : null;
}

export async function listFeaturedProducts(limit = 6): Promise<Product[]> {
  const products = await listProducts(50);
  return products.filter((product) => product.featured).slice(0, limit);
}

export async function listNewsArticles(limit?: number): Promise<NewsArticle[]> {
  try {
    const collection = await getNewsCollection();
    const query = collection.find({}, { sort: { date: -1, updatedAt: -1 } });
    if (limit) {
      query.limit(limit);
    }
    const records = await query.toArray();

    if (records.length === 0) {
      return staticNewsArticles.map(normalizeNewsArticle);
    }

    return records.map((record) => {
      const { _id, updatedAt, ...article } = record;
      void _id;
      void updatedAt;
      return normalizeNewsArticle(article);
    });
  } catch {
    return staticNewsArticles.map(normalizeNewsArticle);
  }
}

export async function listNewsArticlesPage(page = 1, pageSize = 10): Promise<PagedResult<NewsArticle>> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, Math.min(pageSize, 50));
  const skip = (safePage - 1) * safePageSize;

  try {
    const collection = await getNewsCollection();
    const [records, totalItems] = await Promise.all([
      collection
        .find({}, { sort: { date: -1, updatedAt: -1 } })
        .skip(skip)
        .limit(safePageSize)
        .toArray(),
      collection.countDocuments(),
    ]);

    if (records.length === 0 && totalItems === 0) {
      const fallback = staticNewsArticles.map(normalizeNewsArticle);
      const totalPages = Math.max(1, Math.ceil(fallback.length / safePageSize));
      return {
        items: fallback.slice(skip, skip + safePageSize),
        page: safePage,
        pageSize: safePageSize,
        totalItems: fallback.length,
        totalPages,
      };
    }

    const items = records.map((record) => {
      const { _id, updatedAt, ...article } = record;
      void _id;
      void updatedAt;
      return normalizeNewsArticle(article);
    });

    return {
      items,
      page: safePage,
      pageSize: safePageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / safePageSize)),
    };
  } catch {
    const fallback = staticNewsArticles.map(normalizeNewsArticle);
    const totalPages = Math.max(1, Math.ceil(fallback.length / safePageSize));
    return {
      items: fallback.slice(skip, skip + safePageSize),
      page: safePage,
      pageSize: safePageSize,
      totalItems: fallback.length,
      totalPages,
    };
  }
}

export async function getNewsCount(): Promise<number> {
  try {
    const collection = await getNewsCollection();
    return await collection.countDocuments();
  } catch {
    return staticNewsArticles.length;
  }
}

export async function getProductNamesForDropdown(): Promise<{ slug: string; name: { en: string; vi: string } }[]> {
  try {
    const collection = await getProductsCollection();
    const records = await collection.find({}, { projection: { slug: 1, name: 1 }, sort: { featured: -1, updatedAt: -1 } }).toArray();
    if (records.length === 0) {
      return staticProducts.map(p => ({ slug: p.slug, name: p.name }));
    }
    return records.map(r => ({ slug: r.slug, name: r.name }));
  } catch {
    return staticProducts.map(p => ({ slug: p.slug, name: p.name }));
  }
}

export async function listRecentArticles(limit = 6): Promise<NewsArticle[]> {
  return listNewsArticles(limit);
}
export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const collection = await getNewsCollection();
    const record = await collection.findOne({ slug });

    if (record) {
      const { _id, updatedAt, ...article } = record;
      void _id;
      void updatedAt;
      return normalizeNewsArticle(article);
    }
  } catch {
    // Fall through to static data.
  }

  const fallback = staticNewsArticles.find((item) => item.slug === slug);
  return fallback ? normalizeNewsArticle(fallback) : null;
}

export async function upsertProduct(payload: Product) {
  const collection = await getProductsCollection();
  const product = normalizeProduct(payload);

  await collection.updateOne(
    { slug: product.slug },
    {
      $set: {
        ...product,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );
}

export async function deleteProduct(slug: string) {
  const collection = await getProductsCollection();
  await collection.deleteOne({ slug });
}

export async function upsertNewsArticle(payload: NewsArticle) {
  const collection = await getNewsCollection();

  await collection.updateOne(
    { slug: payload.slug },
    {
      $set: {
        ...payload,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );
}

export async function deleteNewsArticle(slug: string) {
  const collection = await getNewsCollection();
  await collection.deleteOne({ slug });
}

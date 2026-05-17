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

export async function listProducts(): Promise<Product[]> {
  try {
    const collection = await getProductsCollection();
    const records = await collection
      .find({}, { sort: { featured: -1, updatedAt: -1 } })
      .toArray();

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
  const products = await listProducts();
  return products.filter((product) => product.featured).slice(0, limit);
}

export async function listNewsArticles(): Promise<NewsArticle[]> {
  try {
    const collection = await getNewsCollection();
    const records = await collection.find({}, { sort: { date: -1, updatedAt: -1 } }).toArray();

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

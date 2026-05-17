import type { MetadataRoute } from "next";
import { navigationItems } from "@/data/site";
import { listNewsArticles, listProducts } from "@/lib/catalog-repository";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://takob.vercel.app");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [products, newsArticles] = await Promise.all([
    listProducts(),
    listNewsArticles(),
  ]);
  const staticRoutes = navigationItems.map((item) => ({
    url: `${baseUrl}${item.href}`,
    lastModified: now,
  }));
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/san-pham/${product.slug}`,
    lastModified: now,
  }));
  const newsRoutes = newsArticles.map((article) => ({
    url: `${baseUrl}/tin-tuc/${article.slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...productRoutes, ...newsRoutes];
}
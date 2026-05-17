import type { MetadataRoute } from "next";
import { navigationItems, products } from "@/data/site";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = navigationItems.map((item) => ({
    url: `${baseUrl}${item.href}`,
    lastModified: now,
  }));
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/san-pham/${product.slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...productRoutes];
}
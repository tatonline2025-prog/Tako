import type { MetadataRoute } from "next";

const normalizedConfiguredSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();
const useConfiguredSiteUrl =
  normalizedConfiguredSiteUrl.length > 0 &&
  !normalizedConfiguredSiteUrl.includes("localhost");

const baseUrl = useConfiguredSiteUrl
  ? normalizedConfiguredSiteUrl
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://takob.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewlog.ai";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/pricing",
          "/about",
          "/contact",
          "/faq",
          "/privacy",
          "/terms",
          "/brewery-batch-tracking-software",
          "/integrations",
          "/glossary",
          "/comparison/",
        ],
        disallow: [
          "/dashboard",
          "/batches/",
          "/inventory/",
          "/recipes/",
          "/team",
          "/account",
          "/analysis",
          "/export/",
          "/auth/",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

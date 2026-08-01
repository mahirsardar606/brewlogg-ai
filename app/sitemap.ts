import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewlog.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const marketingPages = [
    { path: "", priority: 1.0, changeFreq: "weekly" as const },
    { path: "pricing", priority: 0.9, changeFreq: "monthly" as const },
    { path: "about", priority: 0.7, changeFreq: "monthly" as const },
    { path: "contact", priority: 0.6, changeFreq: "monthly" as const },
    { path: "faq", priority: 0.8, changeFreq: "monthly" as const },
    { path: "privacy", priority: 0.3, changeFreq: "yearly" as const },
    { path: "terms", priority: 0.3, changeFreq: "yearly" as const },
    { path: "brewery-batch-tracking-software", priority: 0.9, changeFreq: "monthly" as const },
    { path: "integrations", priority: 0.7, changeFreq: "monthly" as const },
    { path: "glossary", priority: 0.6, changeFreq: "monthly" as const },
    { path: "comparison/brewers-assistant", priority: 0.5, changeFreq: "monthly" as const },
    { path: "comparison/beerxml", priority: 0.5, changeFreq: "monthly" as const },
  ];

  return marketingPages.map((page) => ({
    url: `${SITE_URL}/${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));
}

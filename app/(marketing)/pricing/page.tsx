import type { Metadata } from "next";
import { PricingContent } from "@/components/pricing/PricingContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewlog.ai";

export const metadata: Metadata = {
  title: "Pricing — BrewLog.ai",
    description:
      "Try 2 batches free. Pro at $9.99/month or $99.99/year for unlimited batch logging, inventory tracking, and PDF export. No contracts, cancel anytime.",
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: "Pricing — BrewLog.ai | Free, Pro Monthly & Pro Yearly",
      description:
        "Try 2 batches free. Pro from $9.99/month for unlimited brewery batch tracking.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "BrewLog.ai Pro",
  description:
    "Unlimited brewery batch tracking software for craft breweries. Includes inventory management, team access, AI analysis, and PDF export.",
  brand: { "@type": "Brand", name: "BrewLog.ai" },
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
      description: "2 trial batches",
    },
    {
      "@type": "Offer",
      name: "Pro Monthly",
      price: "9.99",
      priceCurrency: "USD",
      priceInterval: "monthly",
      description: "Unlimited batches, inventory, team access, AI analysis",
    },
    {
      "@type": "Offer",
      name: "Pro Yearly",
      price: "99.99",
      priceCurrency: "USD",
      priceInterval: "yearly",
      description: "Same as Pro Monthly — billed annually at ~$8.33/month",
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PricingContent />
    </>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewlog.ai";

export const metadata: Metadata = {
  title: "FAQ — BrewLog.ai",
  description:
    "Common questions about BrewLog.ai brewery batch tracking software: pricing, features, data export, team access, and how it compares to spreadsheets.",
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    title: "FAQ — BrewLog.ai Brewery Management Software",
    description:
      "Answers to common questions about BrewLog.ai batch tracking, pricing, features, and more.",
  },
};

const faqs = [
  {
    q: "What is BrewLog.ai?",
    a: "BrewLog.ai is brewery batch tracking software for craft breweries. It lets you log batches, track inventory, manage recipes, export PDF reports, and analyze brewing trends — all from your phone.",
  },
  {
    q: "How is BrewLog.ai different from using a spreadsheet?",
    a: "Spreadsheets are error-prone and don't work well on a phone. BrewLog.ai is built for the brewery floor: tap to log a batch, auto-calculate ABV, and export professional PDFs in seconds. Plus inventory tracking, recipe storage, and AI analysis.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The Free plan includes 2 trial batches, ABV auto-calculation, and single-batch PDF export — no credit card needed. Upgrade to Pro for unlimited batches and all features.",
  },
  {
    q: "How much does Pro cost?",
    a: "Pro is $9.99/month for unlimited batches, inventory management, recipe storage, team access, AI analysis, and PDF export. Cancel anytime.",
  },
  {
    q: "Can I export my data?",
    a: "Yes. Export individual batches or date-range summary reports as PDFs with one click. Your data is always yours — no lock-in.",
  },
  {
    q: "Can my team use BrewLog.ai?",
    a: "Yes. Owners can invite unlimited brewers to their brewery. Brewers can log and view batches and manage inventory. Billing and team management remain with the owner.",
  },
  {
    q: "Is BrewLog.ai mobile-friendly?",
    a: "Yes. BrewLog.ai is designed mobile-first for the brewery floor. Log batches, check inventory, and view your dashboard from any device.",
  },
  {
    q: "How does AI batch analysis work?",
    a: "Once you have 5 or more batches logged, click 'Analyze' to get an AI-powered review of your brewing trends and outliers. The analysis looks at OG, FG, and ABV patterns across your batch history.",
  },
  {
    q: "Can I track inventory?",
    a: "Yes. Add ingredients (malts, hops, yeast, other) with quantities and reorder levels. When you log a batch, you can record which ingredients were used and stock is auto-decremented.",
  },
  {
    q: "What if I need help?",
    a: "Free users get email support. Pro users get priority email support. We typically respond within 24 hours.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="container max-w-3xl mx-auto px-4 py-20">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about BrewLog.ai brewery batch
            tracking software.
          </p>
        </header>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <section key={i} className="rounded-xl border bg-background p-6">
              <h2 className="text-lg font-semibold mb-2">{faq.q}</h2>
              <p className="text-muted-foreground">{faq.a}</p>
            </section>
          ))}
        </div>

        <section className="mt-12 p-6 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
          <h2 className="text-lg font-semibold mb-2">Still have questions?</h2>
          <p className="text-muted-foreground mb-4">
            We&apos;re happy to help. Reach out to our team.
          </p>
          <Link
            href="/contact"
            className="text-amber-600 hover:text-amber-700 font-medium underline underline-offset-4"
          >
            Contact us →
          </Link>
        </section>
      </article>
    </>
  );
}

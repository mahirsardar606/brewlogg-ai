import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewlog.ai";

interface Props {
  params: Promise<{ competitor: string }>;
}

const competitors: Record<string, { name: string; url: string }> = {
  "brewers-assistant": { name: "Brewer's Assistant", url: "" },
  "beerxml": { name: "BeerXML", url: "" },
  "brewfather": { name: "BrewFather", url: "" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitor } = await params;
  const comp = competitors[competitor] || { name: competitor.replace(/-/g, " ") };
  return {
    title: `BrewLog.ai vs ${comp.name} — Brewery Batch Tracking Software Comparison`,
    description: `Compare BrewLog.ai vs ${comp.name}. See why craft breweries choose BrewLog.ai for batch tracking, inventory management, and PDF export.`,
    alternates: { canonical: `${SITE_URL}/comparison/${competitor}` },
    openGraph: {
      title: `BrewLog.ai vs ${comp.name} — Comparison`,
      description: `See how BrewLog.ai compares to ${comp.name} for brewery batch tracking.`,
    },
  };
}

const features = [
  "Mobile-first batch logging",
  "ABV auto-calculation",
  "PDF export (single + summary)",
  "Inventory tracking",
  "Recipe storage",
  "Team access",
  "AI batch analysis",
  "Free trial (2 batches)",
  "Pro plan (unlimited batches)",
  "No credit card to start",
];

function getFeatureSupport(competitor: string): boolean[] {
  // Simulated comparison data — replace with real case studies
  const matrix: Record<string, boolean[]> = {
    "brewers-assistant": [false, true, true, false, true, false, false, false, true, false],
    "beerxml": [false, true, true, false, true, false, false, true, false, true],
    "brewfather": [true, true, true, true, true, true, false, false, true, false],
  };
  return matrix[competitor] || features.map(() => false);
}

export default async function ComparisonPage({ params }: Props) {
  const { competitor } = await params;
  const comp = competitors[competitor] || { name: competitor.replace(/-/g, " "), url: "" };

  const brewlogSupport = features.map(() => true);
  const competitorSupport = getFeatureSupport(competitor);

  return (
    <article className="container max-w-4xl mx-auto px-4 py-20">
      <header className="text-center space-y-4 mb-16">
        <h1 className="text-4xl font-bold tracking-tight">
          BrewLog.ai vs {comp.name}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          See how BrewLog.ai compares to {comp.name} for craft brewery batch
          tracking. Real features, real differences.
        </p>
        <div className="pt-4">
          <Link href="/signup">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8">
              Try BrewLog.ai free
            </Button>
          </Link>
        </div>
      </header>

      <section className="overflow-x-auto" aria-labelledby="comparison-table">
        <h2 id="comparison-table" className="sr-only">Feature comparison</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-amber-600">
              <th className="text-left py-4 px-4 font-semibold">Feature</th>
              <th className="text-center py-4 px-4 font-semibold text-amber-700 dark:text-amber-400">BrewLog.ai</th>
              <th className="text-center py-4 px-4 font-semibold text-muted-foreground">{comp.name}</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, i) => (
              <tr key={feature} className="border-b border-border">
                <td className="py-3 px-4 text-sm">{feature}</td>
                <td className="text-center py-3 px-4">
                  {brewlogSupport[i] ? (
                    <Check className="h-5 w-5 text-green-500 inline" aria-label="Supported" />
                  ) : (
                    <X className="h-5 w-5 text-red-400 inline" aria-label="Not supported" />
                  )}
                </td>
                <td className="text-center py-3 px-4">
                  {competitorSupport[i] ? (
                    <Check className="h-5 w-5 text-green-500 inline" aria-label="Supported" />
                  ) : (
                    <X className="h-5 w-5 text-red-400 inline" aria-label="Not supported" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold text-center">Why switch to BrewLog.ai?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <section className="p-6 rounded-xl border bg-background">
            <h3 className="font-semibold mb-2">Built for the brewery floor</h3>
            <p className="text-sm text-muted-foreground">
              BrewLog.ai is mobile-first. Fill out forms on your phone while
              you&apos;re still in the brewhouse — not at a desk.
            </p>
          </section>
          <section className="p-6 rounded-xl border bg-background">
            <h3 className="font-semibold mb-2">Everything in one place</h3>
            <p className="text-sm text-muted-foreground">
              Batches, inventory, recipes, team access, and PDF export — no
              more juggling between spreadsheets and tools.
            </p>
          </section>
          <section className="p-6 rounded-xl border bg-background">
            <h3 className="font-semibold mb-2">Try before you buy</h3>
            <p className="text-sm text-muted-foreground">
              Log 2 batches free. No credit card required. Upgrade when
              you need unlimited brewing.
            </p>
          </section>
        </div>
      </section>

      {/* Internal navigation */}
      <nav className="mt-12 pt-8 border-t text-center" aria-label="More comparisons">
        <h2 className="text-lg font-semibold mb-4">More comparisons</h2>
        <ul className="flex flex-wrap justify-center gap-4">
          {Object.entries(competitors).map(([slug, c]) =>
            slug !== competitor ? (
              <li key={slug}>
                <Link
                  href={`/comparison/${slug}`}
                  className="text-amber-600 hover:text-amber-700 text-sm underline underline-offset-4"
                >
                  BrewLog.ai vs {c.name}
                </Link>
              </li>
            ) : null
          )}
          <li>
            <Link href="/brewery-batch-tracking-software" className="text-amber-600 hover:text-amber-700 text-sm underline underline-offset-4">
              All features →
            </Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Smartphone, FileDown, Package, Book, Users, Brain } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewlog.ai";

export const metadata: Metadata = {
  title: "Brewery Batch Tracking Software — BrewLog.ai",
  description:
    "The leading brewery batch tracking software for craft breweries. Log batches, track inventory, manage recipes, and export PDF reports — all from your phone. Start free.",
  alternates: { canonical: `${SITE_URL}/brewery-batch-tracking-software` },
  openGraph: {
    title: "Brewery Batch Tracking Software for Craft Breweries | BrewLog.ai",
    description:
      "Stop using spreadsheets. BrewLog.ai is the brewery batch tracking software built for the brewery floor.",
  },
};

export default function BreweryBatchTrackingPage() {
  return (
    <article className="container max-w-4xl mx-auto px-4 py-20">
      <header className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Brewery Batch Tracking Software
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          BrewLog.ai is the brewery batch tracking software craft breweries
          in the US, UK, Europe, and UAE use to replace spreadsheets. Log
          batches, track inventory, and export reports — all from your phone.
        </p>
        <div className="pt-4">
          <Link href="/signup">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8">
              Start free — no credit card
            </Button>
          </Link>
        </div>
      </header>

      <section className="space-y-16" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">Features</h2>

        {/* Batch Logging */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center" aria-hidden="true">
              <Smartphone className="h-6 w-6 text-amber-700 dark:text-amber-300" />
            </div>
            <h3 className="text-2xl font-bold">Log Batches in Seconds</h3>
            <p className="text-muted-foreground">
              Our brewery batch tracking software is built for the brewery floor.
              Enter date, beer name, batch number, OG, and FG. ABV calculates
              automatically. Add notes. Done — in under 30 seconds.
            </p>
          </div>
          <div className="bg-muted rounded-xl p-8 text-center">
            <p className="text-6xl mb-4">📋</p>
            <p className="text-lg font-semibold">Batch #42 — Hoppy IPA</p>
            <p className="text-sm text-muted-foreground">OG 1.050 | FG 1.010 | ABV 5.25%</p>
          </div>
        </section>

        {/* PDF Export */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 md:order-2">
            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center" aria-hidden="true">
              <FileDown className="h-6 w-6 text-amber-700 dark:text-amber-300" />
            </div>
            <h3 className="text-2xl font-bold">Export Professional PDF Reports</h3>
            <p className="text-muted-foreground">
              Export individual batch reports or date-range summaries as PDFs.
              Perfect for records, compliance, or sharing with your team.
            </p>
          </div>
          <div className="bg-muted rounded-xl p-8 text-center md:order-1">
            <p className="text-6xl mb-4">📄</p>
            <p className="text-lg font-semibold">Batch Report PDF</p>
            <p className="text-sm text-muted-foreground">Single batch or summary</p>
          </div>
        </section>

        {/* Inventory */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center" aria-hidden="true">
              <Package className="h-6 w-6 text-amber-700 dark:text-amber-300" />
            </div>
            <h3 className="text-2xl font-bold">Track Inventory</h3>
            <p className="text-muted-foreground">
              Manage ingredients with stock levels and reorder alerts. When
              you log a batch, ingredients used are auto-decremented from
              inventory.
            </p>
          </div>
          <div className="bg-muted rounded-xl p-8 text-center">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-lg font-semibold">50 kg Pale Malt</p>
            <p className="text-sm text-amber-600 font-medium">Below reorder level</p>
          </div>
        </section>

        {/* Recipes + AI */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 md:order-2">
            <div className="flex gap-2">
              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center" aria-hidden="true">
                <Book className="h-6 w-6 text-amber-700 dark:text-amber-300" />
              </div>
              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center" aria-hidden="true">
                <Brain className="h-6 w-6 text-amber-700 dark:text-amber-300" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">Recipes & AI Analysis</h3>
            <p className="text-muted-foreground">
              Store your recipes with malt bills, hop schedules, and targets.
              Pre-fill batch logs from recipes. Once you have 5+ batches, AI
              analysis spots trends and outliers to help you brew better.
            </p>
          </div>
          <div className="bg-muted rounded-xl p-8 text-center md:order-1">
            <p className="text-6xl mb-4">📖</p>
            <p className="text-lg font-semibold">Galaxy IPA Recipe</p>
            <p className="text-sm text-muted-foreground">OG 1.058 | FG 1.012 | 45 IBU</p>
          </div>
        </section>

        {/* Team */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center" aria-hidden="true">
              <Users className="h-6 w-6 text-amber-700 dark:text-amber-300" />
            </div>
            <h3 className="text-2xl font-bold">Team Access</h3>
            <p className="text-muted-foreground">
              Invite your brewers. Everyone sees the same batches, inventory,
              and recipes. Owners manage billing. Brewers focus on brewing.
            </p>
          </div>
          <div className="bg-muted rounded-xl p-8 text-center">
            <p className="text-6xl mb-4">👥</p>
            <p className="text-lg font-semibold">Your Brewery Team</p>
            <p className="text-sm text-muted-foreground">Owner + up to 10 brewers</p>
          </div>
        </section>
      </section>

      {/* CTA */}
      <section className="mt-20 text-center space-y-6 py-16 px-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-stone-900">
        <h2 className="text-3xl font-bold">
          Ready to modernize your brewery batch tracking?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join 500+ craft breweries using BrewLog.ai to log batches, track
          inventory, and export reports. The best craft brewery software —
          free to start — try 2 batches.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8">
              Start free
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg">
              View pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Internal links */}
      <nav className="mt-12 pt-8 border-t" aria-label="Related pages">
        <h2 className="text-lg font-semibold mb-4">Learn more</h2>
        <ul className="grid md:grid-cols-3 gap-4">
          <li>
            <Link href="/integrations" className="text-amber-600 hover:text-amber-700 text-sm underline underline-offset-4">
              Integrations for craft breweries
            </Link>
          </li>
          <li>
            <Link href="/glossary" className="text-amber-600 hover:text-amber-700 text-sm underline underline-offset-4">
              Brewing glossary
            </Link>
          </li>
          <li>
            <Link href="/faq" className="text-amber-600 hover:text-amber-700 text-sm underline underline-offset-4">
              Frequently asked questions
            </Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Shield } from "lucide-react";

const MONTHLY_PRICE = 9.99;
const YEARLY_PRICE = 99.99;
const YEARLY_MONTHLY = YEARLY_PRICE / 12;

export function PricingContent() {
  const [yearly, setYearly] = useState(false);

  const proPrice = yearly ? YEARLY_PRICE : MONTHLY_PRICE;
  const proLabel = yearly ? "/year" : "/month";

  return (
    <article className="container max-w-6xl mx-auto px-4 py-24">
      <header className="text-center space-y-6 mb-16">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg">
          Start free. Upgrade to Pro when you&apos;re ready to brew more.
          No contracts, cancel anytime.
        </p>
      </header>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-4 mb-16">
        <span className={`text-sm font-medium ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          aria-label="Toggle yearly billing"
          onClick={() => setYearly(!yearly)}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            yearly ? "bg-amber-600" : "bg-input"
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm ${
              yearly ? "translate-x-[26px]" : "translate-x-[3px]"
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
          Yearly <span className="text-green-600 font-semibold bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full text-xs">Save 17%</span>
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
        {/* Free Plan */}
        <article className="rounded-2xl border border-border/60 bg-background p-8 flex flex-col h-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Free</h2>
            <p className="text-muted-foreground mt-2">Try 2 batches free, no credit card</p>
          </div>
          <div className="mt-4 mb-8">
            <span className="text-5xl font-bold">$0</span>
            <span className="text-muted-foreground text-lg"> /month</span>
          </div>
          <ul className="space-y-4 flex-1 mb-8">
            {[
              "2 batches to try",
              "ABV auto-calculation",
              "PDF export (single batch)",
              "Mobile-friendly form",
              "Email support",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <Link href="/signup" className="mt-auto">
            <Button variant="outline" className="w-full" size="lg">
              Try 2 batches free
            </Button>
          </Link>
        </article>

        {/* Pro Plan */}
        <article className="rounded-2xl border-2 border-amber-500 bg-background p-8 flex flex-col relative h-full shadow-xl shadow-amber-500/10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-to-r from-amber-600 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
              MOST POPULAR
            </span>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Pro</h2>
            <p className="text-muted-foreground mt-2">For serious craft breweries</p>
          </div>
          <div className="mt-4 mb-8">
            <span className="text-5xl font-bold">${proPrice.toFixed(2)}</span>
            <span className="text-muted-foreground text-lg"> {proLabel}</span>
            {yearly && (
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                ${YEARLY_MONTHLY.toFixed(2)}/month billed annually
              </p>
            )}
          </div>
          {yearly && (
            <div className="mb-6">
              <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                Save 17% with annual billing
              </span>
            </div>
          )}
          <ul className="space-y-4 flex-1 mb-8">
            {[
              "Unlimited batches",
              "ABV auto-calculation",
              "PDF export (single + date-range)",
              "Inventory management",
              "Recipe storage",
              "Team access (unlimited brewers)",
              "AI batch analysis",
              "Mobile-first form",
              "Priority email support",
              "Cancel anytime",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm font-medium">{feature}</span>
              </li>
            ))}
          </ul>
          <Link href="/signup" className="mt-auto">
            <Button
              className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white shadow-lg shadow-amber-600/25"
              size="lg"
            >
              Get Pro — ${proPrice.toFixed(2)}{proLabel}
            </Button>
          </Link>
        </article>
      </div>

      {/* Trust badges */}
      <div className="mt-20 text-center">
        <p className="text-sm text-muted-foreground mb-6">Trusted by breweries worldwide</p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
          {["Cloud-based", "Bank-level encryption", "Cancel anytime", "No hidden fees"].map((badge) => (
            <div key={badge} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              {badge}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

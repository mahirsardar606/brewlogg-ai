import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewlog.ai";

export const metadata: Metadata = {
  title: "Brewing Glossary — BrewLog.ai",
  description:
    "Learn brewing terms and definitions. From Original Gravity to IBU, our brewing glossary helps you understand batch tracking and brew house metrics.",
  alternates: { canonical: `${SITE_URL}/glossary` },
  openGraph: {
    title: "Brewing Glossary | BrewLog.ai",
    description: "Definitions of common brewing terms used in craft brewery batch tracking.",
  },
};

const terms = [
  { term: "Original Gravity (OG)", definition: "The specific gravity of wort before fermentation. A measure of the fermentable sugar content, typically between 1.030 and 1.080 for most beers. Higher OG means higher potential alcohol." },
  { term: "Final Gravity (FG)", definition: "The specific gravity of beer after fermentation is complete. Lower FG indicates more sugars were fermented. Combined with OG, it's used to calculate ABV." },
  { term: "ABV (Alcohol by Volume)", definition: "The percentage of alcohol in your beer. Calculated as (OG - FG) × 131.25. The standard measure of alcoholic strength worldwide." },
  { term: "IBU (International Bitterness Units)", definition: "A measure of the bitterness of beer, derived from hops. Scales from 0 (no bitterness) to 100+ (extremely bitter). IPAs typically range from 40-70 IBU." },
  { term: "SRM (Standard Reference Method)", definition: "A scale for measuring beer color. Ranges from 2 (pale lager) to 40+ (stout). Lower numbers indicate lighter beers." },
  { term: "Attenuation", definition: "The percentage of sugars fermented by yeast. Calculated as ((OG - FG) / (OG - 1)) × 100. High attenuation (75-85%) means more fermentable sugars were converted." },
  { term: "Malt Bill", definition: "The complete list of malts and grains used in a recipe, including quantities. The malt bill determines the beer's color, flavor, and fermentable sugar profile." },
  { term: "Hop Schedule", definition: "The timing and quantities of hop additions during the boil. Hops added early contribute bitterness; hops added late contribute aroma and flavor." },
  { term: "Wort", definition: "The liquid extracted from mashing grains that becomes beer after fermentation. Wort contains sugars, proteins, and minerals essential for fermentation." },
  { term: "Mashing", definition: "The process of mixing crushed malt with hot water to convert starches into fermentable sugars. Typical mash temperatures range from 148-158°F." },
  { term: "Batch Number", definition: "A unique sequential identifier for each batch brewed. BrewLog.ai uses batch numbers to organize and reference brewing history." },
  { term: "Fermentation", definition: "The process where yeast converts sugars in wort into alcohol and carbon dioxide. Primary fermentation typically lasts 5-14 days." },
  { term: "Gravity", definition: "A measure of density relative to water, used to track fermentation progress. Modern brewing software like BrewLog.ai calculates and tracks gravity automatically." },
  { term: "Yeast", definition: "The microorganism responsible for fermentation. Different yeast strains produce different flavor profiles and attenuation levels." },
  { term: "Lautering", definition: "The process of separating the liquid wort from the spent grain after mashing. Efficiency here affects your OG." },
];

export default function GlossaryPage() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const grouped = alphabet.map((letter) => ({
    letter,
    terms: terms.filter((t) => t.term.charAt(0).toUpperCase() === letter),
  })).filter((g) => g.terms.length > 0);

  return (
    <article className="container max-w-3xl mx-auto px-4 py-20">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Brewing Glossary</h1>
        <p className="text-lg text-muted-foreground">
          Common brewing terms and definitions for craft brewers using batch
          tracking software.
        </p>
      </header>

      {/* Alphabet jump nav */}
      <nav className="flex flex-wrap gap-2 mb-12" aria-label="Glossary alphabet">
        {grouped.map((g) => (
          <a
            key={g.letter}
            href={`#letter-${g.letter}`}
            className="w-8 h-8 rounded bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-sm font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
          >
            {g.letter}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {grouped.map((g) => (
          <section key={g.letter} id={`letter-${g.letter}`}>
            <h2 className="text-2xl font-bold mb-4 text-amber-700 dark:text-amber-400">
              {g.letter}
            </h2>
            <dl className="space-y-6">
              {g.terms.map((t) => (
                <div key={t.term} className="border-l-2 border-amber-200 dark:border-amber-800 pl-4">
                  <dt className="font-semibold">{t.term}</dt>
                  <dd className="text-sm text-muted-foreground mt-1">{t.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <nav className="mt-12 pt-8 border-t text-center" aria-label="Related">
        <Link href="/brewery-batch-tracking-software" className="text-amber-600 hover:text-amber-700 underline underline-offset-4">
          Learn how BrewLog.ai tracks these metrics →
        </Link>
      </nav>
    </article>
  );
}

import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewlog.ai";

export const metadata: Metadata = {
  title: "About — BrewLog.ai",
  description:
    "BrewLog.ai was built by brewers, for brewers. Our mission is simple: make brewery batch tracking as fast and painless as possible.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About BrewLog.ai | Craft Brewery Software",
    description: "The story behind the brewery batch tracking software built for the brewery floor.",
  },
};

export default function AboutPage() {
  return (
    <article className="container max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">About BrewLog.ai</h1>

      <div className="space-y-6">
        <section>
          <p className="text-lg text-muted-foreground leading-relaxed">
            BrewLog.ai was built by brewers, for brewers. We know that the last
            thing you want to do after a long brew day is sit at a computer and
            type numbers into a spreadsheet.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-12 mb-4">Our mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our mission is simple: make brewery batch tracking as fast and
            painless as possible. Log your OG, FG, and notes from your phone
            while you&apos;re still on the brewery floor. Export professional
            reports in seconds. Get back to making great beer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-12 mb-4">
            Why BrewLog.ai?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Most batch tracking tools are either glorified spreadsheets or
            over-engineered ERP systems built for massive operations. We
            believe small and mid-sized craft breweries deserve something
            better — a tool that&apos;s powerful enough to be useful, simple
            enough to actually use.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-12 mb-4">Our values</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              <strong>Simplicity first.</strong> Every feature should make the
              brewer&apos;s life easier, not more complicated.
            </li>
            <li>
              <strong>Mobile by default.</strong> Breweries happen on the floor,
              not at a desk.
            </li>
            <li>
              <strong>No lock-in.</strong> Your data is yours. Export anything
              anytime.
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
}

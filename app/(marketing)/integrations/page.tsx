import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewlog.ai";

export const metadata: Metadata = {
  title: "Integrations — BrewLog.ai",
  description:
    "BrewLog.ai integrates with the tools you already use. Paddle for billing, Resend for email, and more. Extend your brewery management software stack.",
  alternates: { canonical: `${SITE_URL}/integrations` },
  openGraph: {
    title: "Integrations | BrewLog.ai Craft Brewery Software",
    description:
      "See how BrewLog.ai integrates with Paddle, Resend, Supabase, and more to power your brewery.",
  },
};

const integrations = [
  { name: "Supabase", description: "Secure PostgreSQL database and authentication infrastructure powering BrewLog.ai.", type: "Infrastructure" },
  { name: "Paddle", description: "Payment processing and subscription management for Pro plan billing.", type: "Billing" },
  { name: "Resend", description: "Transactional email delivery for account confirmation and invites.", type: "Email" },
  { name: "OpenAI", description: "AI-powered batch analysis that spots trends and outliers in your brewing data.", type: "AI" },
  { name: "Google OAuth", description: "Sign in with your Google account for quick, secure authentication.", type: "Auth" },
  { name: "Vercel", description: "Hosting and deployment platform ensuring fast, reliable global availability.", type: "Infrastructure" },
];

export default function IntegrationsPage() {
  return (
    <article className="container max-w-4xl mx-auto px-4 py-20">
      <header className="text-center space-y-4 mb-16">
        <h1 className="text-4xl font-bold tracking-tight">
          Integrations
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          BrewLog.ai connects with the tools you already trust. No complex
          setup — everything works out of the box.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <section key={integration.name} className="rounded-xl border bg-background p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <span className="text-lg font-bold text-amber-700 dark:text-amber-300">
                  {integration.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="font-semibold">{integration.name}</h2>
                <p className="text-xs text-muted-foreground">{integration.type}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{integration.description}</p>
          </section>
        ))}
      </div>

      <section className="mt-16 p-8 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-center space-y-4">
        <h2 className="text-2xl font-bold">Want to build an integration?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          BrewLog.ai is built on standard APIs. Contact us to discuss custom
          integrations for your brewery management workflow.
        </p>
        <Link
          href="/contact"
          className="text-amber-600 hover:text-amber-700 font-medium underline underline-offset-4"
        >
          Get in touch →
        </Link>
      </section>

      <nav className="mt-8 text-center" aria-label="Related">
        <Link href="/brewery-batch-tracking-software" className="text-sm text-amber-600 hover:text-amber-700 underline underline-offset-4">
          View all features →
        </Link>
      </nav>
    </article>
  );
}

import type { Metadata } from "next";
import { Mail, MessageSquare, ExternalLink } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewlog.ai";

export const metadata: Metadata = {
  title: "Contact — BrewLog.ai",
  description:
    "Get in touch with the BrewLog.ai team. Email us at hello@brewlog.ai for questions, suggestions, or support.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: "Contact BrewLog.ai | Craft Brewery Software Support",
    description: "Have a question? Contact the BrewLog.ai team.",
  },
};

export default function ContactPage() {
  return (
    <article className="container max-w-3xl mx-auto px-4 py-20">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact us</h1>
        <p className="text-lg text-muted-foreground">
          Have a question, suggestion, or just want to say hi? We&apos;d love to
          hear from you.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="rounded-xl border bg-background p-8 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center" aria-hidden="true">
            <Mail className="h-6 w-6 text-amber-700 dark:text-amber-300" />
          </div>
          <h2 className="text-xl font-semibold">Email us</h2>
          <p className="text-muted-foreground text-sm">
            We typically respond within 24 hours.
          </p>
          <a
            href="mailto:hello@brewlog.ai"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground px-4 py-2 text-sm font-medium w-full transition-colors"
          >
            hello@brewlog.ai
            <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </section>

        <section className="rounded-xl border bg-background p-8 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center" aria-hidden="true">
            <MessageSquare className="h-6 w-6 text-amber-700 dark:text-amber-300" />
          </div>
          <h2 className="text-xl font-semibold">Support</h2>
          <p className="text-muted-foreground text-sm">
            Pro customers get priority support.
          </p>
          <a
            href="mailto:support@brewlog.ai"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground px-4 py-2 text-sm font-medium w-full transition-colors"
          >
            support@brewlog.ai
            <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </section>
      </div>
    </article>
  );
}

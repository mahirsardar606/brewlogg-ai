import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewlog.ai";

export const metadata: Metadata = {
  title: "Terms of Service — BrewLog.ai",
  description:
    "BrewLog.ai terms of service. Details on account registration, subscription billing, data ownership, and usage policies.",
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: false },
};

export default function TermsPage() {
  return (
    <article className="container max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">
        Last updated: July 29, 2026
      </p>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            1. Acceptance of Terms
          </h2>
          <p>
            By signing up for and using BrewLog.ai, you agree to these Terms
            of Service. If you do not agree, do not use the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            2. Description of Service
          </h2>
          <p>
            BrewLog.ai provides a web-based brewery batch tracking tool for
            craft breweries. Users can log batches, view history, export PDFs,
            track inventory, manage recipes, and manage their account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            3. Account Registration
          </h2>
          <p>
            You must create an account to use BrewLog.ai. You are responsible
            for maintaining the confidentiality of your login credentials and
            for all activity under your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            4. Subscription &amp; Billing
          </h2>
          <p>
            BrewLog.ai offers Free and Pro subscription plans. Free accounts
            are limited to 2 trial batches. Pro accounts are billed monthly at
             $9.99. Payments are processed securely by Paddle. You may cancel
            your subscription at any time. Cancellation takes effect at the
            end of the current billing period.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            5. Data Ownership
          </h2>
          <p>
            You retain full ownership of all batch data you enter into
            BrewLog.ai. We claim no intellectual property rights over your
            data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            6. Limitation of Liability
          </h2>
          <p>
            BrewLog.ai is provided &quot;as is&quot; without warranty of any
            kind. We are not liable for any damages arising from your use of
            the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            7. Termination
          </h2>
          <p>
            We reserve the right to terminate accounts that violate these
            terms or engage in abusive behavior. You may delete your account
            at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            8. Changes to Terms
          </h2>
          <p>
            We may modify these terms at any time. Continued use of
            BrewLog.ai after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">9. Contact</h2>
          <p>
            For questions about these terms, contact us at hello@brewlog.ai.
          </p>
        </section>
      </div>
    </article>
  );
}

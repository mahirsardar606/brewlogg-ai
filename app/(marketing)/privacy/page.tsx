import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewlog.ai";

export const metadata: Metadata = {
  title: "Privacy Policy — BrewLog.ai",
  description:
    "BrewLog.ai privacy policy. Learn how we collect, store, and protect your brewery batch tracking data.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: false },
};

export default function PrivacyPage() {
  return (
    <article className="container max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">
        Last updated: July 29, 2026
      </p>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            1. Information We Collect
          </h2>
          <p>
            When you sign up for BrewLog.ai, we collect your email address and
            brewery name. When you use our service, we store the batch data you
            enter (beer names, gravity readings, notes, etc.).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            2. How We Use Your Information
          </h2>
          <p>
            We use your information solely to provide and improve the
            BrewLog.ai service. We do not sell your personal data or batch
            data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            3. Data Storage
          </h2>
          <p>
            Your data is stored securely on Supabase (PostgreSQL) servers. We
            use industry-standard encryption for data in transit and at rest.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            4. Payment Processing
          </h2>
          <p>
            We use Paddle for payment processing. Paddle handles all payment
            information and is PCI-DSS compliant. We never store your credit
            card details on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            5. Data Export &amp; Deletion
          </h2>
          <p>
            You can export your data as PDF at any time. To delete your
            account and all associated data, contact us at hello@brewlog.ai.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            6. Contact
          </h2>
          <p>
            For privacy-related inquiries, contact us at hello@brewlog.ai.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            7. Changes to This Policy
          </h2>
          <p>
            We may update this privacy policy from time to time. We will
            notify you of any changes by email or through the app.
          </p>
        </section>
      </div>
    </article>
  );
}

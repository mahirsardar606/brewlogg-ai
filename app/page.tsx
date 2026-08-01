import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Smartphone, FileDown, Package, BarChart3, Users, Shield, Sparkles, ArrowRight, Beer, TrendingUp, Check } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewlog.ai";

export const metadata: Metadata = {
  title: "BrewLog.ai — Brewery Batch Tracking Software for Craft Breweries",
  description:
    "BrewLog.ai is the brewery batch tracking software craft breweries use to log batches, track inventory, and export PDF reports. Stop using spreadsheets — start brewing.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    title: "BrewLog.ai — Brewery Batch Tracking Software for Craft Breweries",
    description:
      "Stop tracking brews in a spreadsheet. Log batches, export reports, manage inventory — all from your phone.",
    url: SITE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BrewLog.ai",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "Mobile-first brewery batch tracking software for craft breweries.",
  url: SITE_URL,
  brand: { "@type": "Brand", name: "BrewLog.ai" },
  offers: { "@type": "AggregateOffer", lowPrice: "0", highPrice: "9.99", priceCurrency: "USD" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "127", bestRating: "5" },
};

const features = [
  { icon: Smartphone, title: "Mobile-first", desc: "Log a batch in under 30 seconds from your phone on the brewery floor." },
  { icon: FileDown, title: "PDF Export", desc: "Export professional batch reports and summaries with one tap." },
  { icon: BarChart3, title: "AI Analysis", desc: "Spot trends and outliers as your batch history grows — make data-driven decisions." },
  { icon: Package, title: "Inventory", desc: "Track ingredients with stock alerts. Auto-decrement when you log a batch." },
  { icon: Users, title: "Team Access", desc: "Invite your brewers. Everyone sees the same batches, inventory, and recipes." },
  { icon: Shield, title: "Secure & Compliant", desc: "Your data is encrypted and securely hosted with regular backups." },
];

export default function LandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="min-h-screen">
        {/* Glass Nav */}
        <nav className="glass-nav sticky top-0 z-50 w-full">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="BrewLog.ai" width={240} height={74} className="h-12 w-auto md:h-14 object-contain" />
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-full">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20">
                  Start free
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden px-4 pt-20 pb-28 md:pt-32 md:pb-40">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-background to-background dark:from-amber-950/30 dark:via-background dark:to-background" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-amber-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-orange-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

          {/* Decorative grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#D97706/0.03_1px,transparent_1px),linear-gradient(to_bottom,#D97706/0.03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

          <div className="container max-w-6xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-200/60 bg-amber-50/80 dark:bg-amber-900/20 dark:border-amber-700/40 text-sm text-amber-900 dark:text-amber-100 mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="font-medium">Trusted by 500+ craft breweries worldwide</span>
            </div>
            <div className="space-y-8 animate-slide-up">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
                Brewery batch tracking{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-gradient-animate">for craft breweries</span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-amber-200/40 dark:bg-amber-700/30 -z-0 rounded-full" />
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Stop tracking brews in a spreadsheet. BrewLog.ai is the brewery batch tracking software built for the brewery floor. Create, track, and export batches — all from your phone.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link href="/signup">
                <Button size="lg" className="rounded-full btn-primary px-10 text-lg h-14">
                  Start logging for free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="rounded-full px-10 text-lg h-14 border-2 border-amber-200 hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all duration-300 hover:scale-105">
                  See pricing
                </Button>
              </Link>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">Free to start • No credit card • 2 trial batches</p>

            {/* App Preview */}
            <div className="mt-20 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
              <div className="relative mx-auto max-w-5xl">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-3 w-3 rounded-full bg-red-400 animate-pulse" />
                  <div className="h-3 w-3 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
                <div className="relative rounded-2xl border-2 border-border/60 bg-card shadow-2xl overflow-hidden animate-slide-up">
                  <div className="bg-muted/50 px-4 py-3 border-b border-border/60 flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-border animate-pulse" />
                    <div className="h-2 w-12 rounded-full bg-border/50 animate-pulse" style={{ animationDelay: "0.1s" }} />
                  </div>
                   <div className="grid md:grid-cols-3 gap-6 p-6 md:p-8">
                     {[
                       { title: "Total Batches", value: "24", sub: "+3 this week", color: "from-amber-500 to-orange-500", icon: Beer },
                       { title: "Avg ABV", value: "6.2%", sub: "Across all batches", color: "from-blue-500 to-cyan-500", icon: TrendingUp },
                       { title: "Inventory", value: "12", sub: "Items in stock", color: "from-green-500 to-emerald-500", icon: Package },
                     ].map((stat) => {
                       const StatIcon = stat.icon;
                       return (
                       <div key={stat.title} className="rounded-xl border border-border/60 bg-background p-5 card-hover">
                         <div className="flex items-center justify-between mb-2">
                           <p className="text-sm text-muted-foreground">{stat.title}</p>
                           <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                             <StatIcon className="h-4 w-4 text-white" />
                           </div>
                         </div>
                         <p className="text-3xl font-bold mb-2">{stat.value}</p>
                         <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                           <div className={`h-full w-3/4 rounded-full bg-gradient-to-r ${stat.color} animate-pulse`} />
                         </div>
                         <p className="text-xs text-muted-foreground mt-2">{stat.sub}</p>
                       </div>
                       );
                     })}
                   </div>
                  <div className="px-6 md:px-8 pb-8">
                    <div className="rounded-xl border border-border/60 bg-background p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Recent Batches</h3>
                        <span className="text-xs text-muted-foreground">View all</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: "Hazy IPA", batch: "#104", abv: "6.8%", og: "1.065", date: "Jul 28" },
                          { name: "Porter", batch: "#103", abv: "5.2%", og: "1.052", date: "Jul 21" },
                          { name: "Wheat Beer", batch: "#102", abv: "4.8%", og: "1.045", date: "Jul 14" },
                        ].map((batch) => (
                          <div key={batch.batch} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors rounded-lg px-2 -mx-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Beer className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{batch.name}</p>
                                <p className="text-xs text-muted-foreground">Batch {batch.batch} • OG {batch.og}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{batch.abv} ABV</p>
                              <p className="text-xs text-muted-foreground">{batch.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 border-y border-border/40 bg-card/50">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
              {[
                { num: "500+", label: "Breweries" },
                { num: "50k+", label: "Batches logged" },
                { num: "4.8★", label: "Average rating" },
                { num: "30+", label: "Countries" },
              ].map((s) => (
                <div key={s.label} className="space-y-2">
                  <p className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">{s.num}</p>
                  <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-28 px-4 bg-background relative overflow-hidden" aria-labelledby="features-heading">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl" />
            <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-orange-500/5 blur-3xl" />
          </div>
          <div className="container max-w-6xl mx-auto relative">
            <div className="text-center space-y-6 mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-200/60 bg-amber-50/80 dark:bg-amber-900/20 dark:border-amber-700/40 text-xs font-medium text-amber-900 dark:text-amber-100 mb-2 animate-fade-in">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                Features
              </div>
              <h2 id="features-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Everything you need to{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500">log your batches</span>
                  <span className="absolute bottom-1 left-0 w-full h-2.5 bg-amber-200/40 dark:bg-amber-700/30 -z-0 rounded-full" />
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The complete brewery batch tracking software for modern craft breweries. Simple enough for your taproom staff, powerful enough for your brewmaster.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                <article
                  key={f.title}
                  className="group relative rounded-3xl border border-border/60 bg-background p-8 card-hover animate-slide-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/0 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm ring-1 ring-amber-200/50 dark:ring-amber-700/30">
                      <Icon className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-semibold text-xl mb-3 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-28 px-4 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-orange-400/5 blur-3xl" />
          </div>
          <div className="container max-w-5xl mx-auto relative">
            <div className="text-center space-y-4 mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-200/60 bg-amber-50/80 dark:bg-amber-900/20 dark:border-amber-700/40 text-xs font-medium text-amber-900 dark:text-amber-100 mb-2 animate-fade-in">
                How it works
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Three simple steps to transform your brewery operations</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
              {[
                { step: "1", title: "Sign up", desc: "Create your account in 30 seconds. No credit card required for the free trial.", icon: Users, color: "from-amber-500 to-orange-500" },
                { step: "2", title: "Log batches", desc: "Record batch details from your phone. Auto-calculate ABV and track every ingredient.", icon: Smartphone, color: "from-blue-500 to-cyan-500" },
                { step: "3", title: "Grow smarter", desc: "Export PDFs, analyze trends, and manage inventory. Upgrade when you need unlimited batches.", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                <div key={item.step} className="relative text-center space-y-6 group">
                  <div className="relative inline-flex">
                    <div className={`absolute -inset-3 rounded-3xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                    <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-xl shadow-amber-500/25 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}>
                      <Icon className="h-9 w-9" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-background bg-muted text-[10px] font-bold flex items-center justify-center">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-28 px-4 bg-background relative overflow-hidden" aria-labelledby="testimonials-heading">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl" />
            <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-orange-500/5 blur-3xl" />
          </div>
          <div className="container max-w-6xl mx-auto relative">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-200/60 bg-amber-50/80 dark:bg-amber-900/20 dark:border-amber-700/40 text-xs font-medium text-amber-900 dark:text-amber-100 mb-2 animate-fade-in">
                Testimonials
              </div>
              <h2 id="testimonials-heading" className="text-4xl md:text-5xl font-bold tracking-tight">
                Loved by{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">brewers</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">See what craft brewery owners are saying about BrewLog.ai</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "We replaced three spreadsheets with BrewLog.ai. Logging a batch now takes 20 seconds instead of 10 minutes.",
                  name: "Sarah Chen",
                  role: "Head Brewer, Hoppy Trails Brewing Co.",
                  avatar: "SC",
                },
                {
                  quote: "The AI analysis alone is worth it. We spotted a consistent FG drop that was costing us flavor. BrewLog.ai paid for itself in one month.",
                  name: "Mike Rodriguez",
                  role: "Owner, River City Craft Beer",
                  avatar: "MR",
                },
                {
                  quote: "Finally, a brewery app that works on the floor. The mobile experience is smooth, the PDF exports look professional, and our team actually uses it.",
                  name: "Emma Larsson",
                  role: "Brewmaster, Nordic Roots Ale",
                  avatar: "EL",
                },
                {
                  quote: "Inventory tracking changed our brew day. We used to run out of hops mid-batch. Now we get alerts before we start. No more surprises.",
                  name: "James O'Sullivan",
                  role: "Head Brewer, Gate City Brewing",
                  avatar: "JO",
                },
                {
                  quote: "The recipe storage is a lifesaver. I can pull up a recipe from six months ago, duplicate it, and tweak it for the next batch in seconds.",
                  name: "Priya Patel",
                  role: "Owner, Golden Hour Cider & Mead",
                  avatar: "PP",
                },
                {
                  quote: "Our brewers used to log batches in notebooks. Now they do it on their phones while they work. Data is consistent, searchable, and always backed up.",
                  name: "Daniel Kim",
                  role: "Operations Manager, Westside Fermentations",
                  avatar: "DK",
                },
              ].map((t) => (
                <div key={t.name} className="group relative rounded-3xl border border-border/60 bg-background p-8 card-hover">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/0 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 text-amber-500 fill-current drop-shadow-sm" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                     <p className="text-sm leading-relaxed mb-6 text-foreground/90">&ldquo;{t.quote}&rdquo;</p>
                     <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/20 flex items-center justify-center text-sm font-semibold text-amber-700 dark:text-amber-300 ring-1 ring-amber-200/50 dark:ring-amber-700/30">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-28 px-4 bg-muted/30 relative overflow-hidden" aria-labelledby="comparison-heading">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl" />
          </div>
          <div className="container max-w-5xl mx-auto relative">
            <div className="text-center space-y-4 mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-200/60 bg-amber-50/80 dark:bg-amber-900/20 dark:border-amber-700/40 text-xs font-medium text-amber-900 dark:text-amber-100 mb-2 animate-fade-in">
                Pricing
              </div>
              <h2 id="comparison-heading" className="text-4xl md:text-5xl font-bold tracking-tight">
                Free vs <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">Pro</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">Start free, upgrade when you need more</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
              <div className="group relative rounded-3xl border border-border/60 bg-background p-8 lg:p-10 transition-all duration-300 hover:border-border/80">
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold">Free</h3>
                      <p className="text-muted-foreground text-sm mt-1">Perfect for trying out BrewLog.ai</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                      <Beer className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  <p className="text-4xl font-bold mb-8 tracking-tight">$0<span className="text-lg text-muted-foreground font-normal ml-1">/month</span></p>
                  <ul className="space-y-3.5 mb-8">
                    {["2 trial batches", "ABV auto-calculation", "Single-batch PDF export", "Mobile-friendly form", "Email support"].map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                        </div>
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="block">
                    <Button variant="outline" className="w-full h-12 rounded-xl text-base font-medium hover:scale-[1.02] transition-transform">Get started free</Button>
                  </Link>
                </div>
              </div>
              <div className="group relative rounded-3xl border-2 border-amber-500 bg-background p-8 lg:p-10 relative shadow-xl shadow-amber-500/10 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-2xl font-bold">Pro</h3>
                        <span className="bg-gradient-to-r from-amber-600 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg tracking-wide">MOST POPULAR</span>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">For serious craft breweries</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-4xl font-bold mb-2 tracking-tight">$9.99<span className="text-lg text-muted-foreground font-normal ml-1">/month</span></p>
                  <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mb-8">Or $99.99/year (save ~$20)</p>
                  <ul className="space-y-3.5 mb-8">
                    {["Unlimited batches", "ABV auto-calculation", "PDF export (single + date-range)", "Inventory management", "Recipe storage", "Team access (unlimited brewers)", "AI batch analysis", "Mobile-first form", "Priority email support", "Cancel anytime"].map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="font-medium text-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="block">
                    <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white shadow-lg shadow-amber-600/30 font-medium text-base hover:scale-[1.02] transition-transform">Start Pro trial</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium CTA */}
        <section className="py-28 px-4">
          <div className="container max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500 p-12 md:p-20 text-center text-white shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
              <div className="relative space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  Ready to ditch the spreadsheet?
                </h2>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                  Join 500+ breweries using the best craft brewery software for batch tracking. Start free, upgrade when you grow.
                </p>
                <div className="pt-4">
                  <Link href="/signup">
                    <Button size="lg" className="rounded-full bg-white text-amber-700 hover:bg-white/90 px-10 text-lg h-14 shadow-xl font-semibold">
                      Get started free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-border/60 bg-muted/30 backdrop-blur-sm py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-amber-500/5 blur-3xl" />
          </div>
          <div className="container max-w-5xl mx-auto relative">
            <div className="grid md:grid-cols-4 gap-12">
              <div className="md:col-span-2">
                <Link href="/" className="flex items-center mb-6">
                  <Image src="/logo.png" alt="BrewLog.ai" width={240} height={74} className="h-12 w-auto md:h-14 object-contain" />
                </Link>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">Batch logging for craft breweries. Simple, fast, mobile-first.</p>
                <Link href="/signup">
                  <Button size="sm" className="rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20">
                    Get started free
                  </Button>
                </Link>
              </div>
              <div>
                <h3 className="font-semibold mb-5 text-sm uppercase tracking-wider text-muted-foreground">Product</h3>
                <ul className="space-y-4">
                  <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block">Pricing</Link></li>
                  <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block">About</Link></li>
                  <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-5 text-sm uppercase tracking-wider text-muted-foreground">Legal</h3>
                <ul className="space-y-4">
                  <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-16 pt-8 border-t border-border/60 text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} BrewLog.ai. All rights reserved.
            </div>
          </div>
        </footer>
      </article>
    </>
  );
}

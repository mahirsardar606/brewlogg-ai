import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-card py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-2">
              <Image src="/logo.png" alt="BrewLog.ai" width={240} height={74} className="h-12 w-auto md:h-14 object-contain" />
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Batch logging for craft breweries. Simple, fast, mobile-first.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} BrewLog.ai. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

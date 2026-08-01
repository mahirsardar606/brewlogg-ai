import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="glass-nav sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="BrewLog.ai" width={240} height={74} className="h-12 w-auto md:h-14 object-contain" />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {["Pricing", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="rounded-full">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20">
              Sign up free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

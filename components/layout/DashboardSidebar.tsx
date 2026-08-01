"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, User, Package, Users, Book, Brain } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Batches", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/recipes", label: "Recipes", icon: Book },
  { href: "/analysis", label: "Analysis", icon: Brain },
  { href: "/team", label: "Team", icon: Users },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 z-40">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center">
          <Image src="/logo.png" alt="BrewLog.ai" width={240} height={74} className="h-10 w-auto object-contain" />
        </Link>
      </div>

      <div className="px-4 mb-6">
        <Link href="/batches/new">
          <Button className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20 h-11 hover:scale-[1.02] transition-transform font-medium">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Batch
          </Button>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const ItemIcon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-amber-100/80 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", isActive ? "bg-amber-200/50 dark:bg-amber-800/50" : "bg-muted/50")}>
                <ItemIcon className="h-4 w-4" />
              </div>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/60">
        <Link href="/account" className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200", pathname === "/account" ? "bg-amber-100/80 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100" : "text-muted-foreground hover:text-foreground hover:bg-muted/60")}>
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", pathname === "/account" ? "bg-amber-200/50 dark:bg-amber-800/50" : "bg-muted/50")}>
            <User className="h-4 w-4" />
          </div>
          Account
        </Link>
      </div>
    </aside>
  );
}

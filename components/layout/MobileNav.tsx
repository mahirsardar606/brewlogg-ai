"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, User, Package, Users, Book, Brain } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Batches", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/recipes", label: "Recipes", icon: Book },
  { href: "/batches/new", label: "New", icon: PlusCircle },
  { href: "/team", label: "Team", icon: Users },
  { href: "/analysis", label: "Analysis", icon: Brain },
  { href: "/account", label: "Account", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  if (!pathname.startsWith("/dashboard") && !pathname.startsWith("/batches") && !pathname.startsWith("/inventory") && !pathname.startsWith("/recipes") && !pathname.startsWith("/analysis") && !pathname.startsWith("/team") && !pathname.startsWith("/account") && !pathname.startsWith("/export")) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/90 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/70">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const ItemIcon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-1.5 py-1.5 text-[10px] font-medium transition-colors rounded-lg min-w-[48px]",
                isActive
                  ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ItemIcon className="h-5 w-5" />
              <span className="truncate max-w-full">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

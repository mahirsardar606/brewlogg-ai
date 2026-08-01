"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LayoutDashboard, PlusCircle, LogOut, User, Package, Users, Book, Brain, Shield } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Batches", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/recipes", label: "Recipes", icon: Book },
  { href: "/analysis", label: "Analysis", icon: Brain },
  { href: "/team", label: "Team", icon: Users },
];

export function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? "");
        supabase.from("profiles").select("role").eq("id", data.user.id).single().then(({ data: profile }) => {
          if (profile && typeof profile === 'object' && 'role' in profile) setRole((profile as { role: string }).role);
        });
      }
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center">
          <Image src="/logo.png" alt="BrewLog.ai" width={240} height={74} className="h-12 w-auto md:h-14 object-contain" />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const LinkIcon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-amber-100/80 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <LinkIcon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          {role === "admin" && (
            <Link href="/dashboard/admin">
              <Button size="sm" variant={pathname.startsWith("/dashboard/admin") ? "default" : "ghost"} className="rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg">
                <Shield className="h-4 w-4 mr-1.5" />
                Admin
              </Button>
            </Link>
          )}
          <Link href="/batches/new">
            <Button size="sm" className="ml-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20 hover:scale-105 transition-transform">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              New Batch
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full focus:outline-none">
              <Avatar className="h-9 w-9 ring-2 ring-amber-200 dark:ring-amber-800 cursor-pointer hover:ring-amber-300 dark:hover:ring-amber-700 transition-all">
                <AvatarFallback className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-sm font-semibold">
                  {email?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl border-border/60 shadow-lg" align="end">
              <div className="px-2 py-1.5 text-sm text-muted-foreground truncate font-medium">{email}</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/account")} className="cursor-pointer rounded-lg">
                <User className="h-4 w-4 mr-2" />
                Account & Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive rounded-lg">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

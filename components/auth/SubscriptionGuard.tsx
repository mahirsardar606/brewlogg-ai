"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const [checking, setChecking] = useState(true);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setChecking(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan_tier")
        .eq("id", user.id)
        .maybeSingle();

      const planTier = (profile as { plan_tier: string } | null)?.plan_tier;

      if (planTier === "pro") {
        setChecking(false);
        return;
      }

      const { count: batchCountResult } = await supabase
        .from("batches")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const currentCount = batchCountResult ?? 0;

      if (currentCount >= 2) {
        setBlocked(true);
      }
      setChecking(false);
    }

    check();
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (blocked) {
    return (
      <div className="text-center py-16 space-y-4 px-4">
        <div className="text-6xl">🔒</div>
        <h3 className="text-lg font-semibold">Free plan limit reached</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          You&apos;ve used all 2 free trial batches. Upgrade to Pro
          for unlimited brewing.
        </p>
        <Link href="/account">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            Upgrade to Pro
          </Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

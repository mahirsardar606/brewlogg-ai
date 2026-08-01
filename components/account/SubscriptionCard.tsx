"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X } from "lucide-react";
import { initPaddle, openPaddleCheckout } from "@/lib/paddle-client";
import type { PlanTier } from "@/types";

interface SubscriptionCardProps {
  planTier: PlanTier;
  userId: string;
}

export function SubscriptionCard({ planTier, userId }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);
  const [yearly, setYearly] = useState(false);

  useEffect(() => {
    initPaddle();
  }, []);

  const monthlyPriceId = process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID;
  const yearlyPriceId = process.env.NEXT_PUBLIC_PADDLE_YEARLY_PRICE_ID;

  const priceId = yearly ? yearlyPriceId : monthlyPriceId;
  const displayPrice = yearly ? "$99.99/year" : "$9.99/month";
  const monthlyEquiv = yearly ? "($8.33/mo)" : "";

  const handleUpgrade = () => {
    if (!priceId) {
      alert(`Paddle price ID not configured. Set NEXT_PUBLIC_PADDLE_${yearly ? "YEARLY" : "MONTHLY"}_PRICE_ID in your environment.`);
      return;
    }
    setLoading(true);
    openPaddleCheckout(priceId, userId);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              Your current plan and billing information
            </CardDescription>
          </div>
          <Badge
            variant={planTier === "pro" ? "default" : "outline"}
            className={
              planTier === "pro"
                ? "bg-amber-600 text-white"
                : "text-muted-foreground"
            }
          >
            {planTier === "pro" ? "Pro" : "Free"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            {planTier === "pro" ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-muted-foreground" />
            )}
            <span>Unlimited batch logging</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Check className="h-4 w-4 text-green-500" />
            <span>ABV auto-calculation</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {planTier === "pro" ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-muted-foreground" />
            )}
            <span>Date-range PDF export</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {planTier === "pro" ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-muted-foreground" />
            )}
            <span>Priority email support</span>
          </div>
        </div>

        {planTier === "free" && (
          <div className="pt-4 border-t space-y-4">
            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3">
              <span className={`text-xs font-medium ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={yearly}
                aria-label="Toggle yearly billing"
                onClick={() => setYearly(!yearly)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  yearly ? "bg-amber-600" : "bg-input"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    yearly ? "translate-x-[18px]" : "translate-x-[2px]"
                  }`}
                />
              </button>
              <span className={`text-xs font-medium ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
                Yearly <span className="text-green-600 font-semibold">Save 17%</span>
              </span>
            </div>

            <Button
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Upgrade to Pro — {displayPrice} {monthlyEquiv}
            </Button>
          </div>
        )}

        {planTier === "pro" && (
          <div className="pt-4 border-t text-sm text-muted-foreground">
            <p>
              You&apos;re on the Pro plan. Manage your subscription through
              Paddle.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

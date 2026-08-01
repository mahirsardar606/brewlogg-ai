"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Brain, TrendingUp, AlertTriangle, History, BarChart3, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { runBatchAnalysis } from "@/lib/actions/analysis-actions";
import type { BatchAnalysis } from "@/types";

interface AnalyzeSectionProps {
  batchCount: number;
  recentAnalyses: BatchAnalysis[];
}

export function AnalyzeSection({ batchCount, recentAnalyses }: AnalyzeSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [latestResult, setLatestResult] = useState<{
    summary: string; trends?: unknown; outliers?: unknown;
  } | null>(null);
  const [usage, setUsage] = useState<{ used: number; limit: number; plan: string } | null>(null);

  const canAnalyze = batchCount >= 5;

  const fetchUsage = async () => {
    try {
      const res = await fetch("/api/ai/usage");
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchUsage();
    const interval = setInterval(fetchUsage, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = () => {
    startTransition(async () => {
      const result = await runBatchAnalysis();
      if (result.success) {
        toast.success("Analysis complete!");
        if (result.analysis) setLatestResult(result.analysis as { summary: string; trends?: unknown; outliers?: unknown });
        router.refresh();
        fetchUsage();
      } else {
        toast.error(result.message || "Analysis failed");
      }
    });
  };

  const isPro = usage?.plan === "pro";
  const remaining = usage ? usage.limit - usage.used : 0;
  const showUsage = isPro && usage && usage.limit > 0;

  return (
    <Card className="border-amber-200/50 dark:border-amber-800/50 overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-600" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-600" />
          AI Batch Analysis
        </CardTitle>
        <CardDescription>
          Analyze OG, FG, and ABV trends across your batches to spot patterns and outliers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!canAnalyze ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
            <BarChart3 className="h-5 w-5 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground">
              Log {5 - batchCount} more batch{batchCount === 4 ? "" : "es"} to unlock AI analysis
              ({batchCount}/5 batches logged).
            </p>
          </div>
        ) : !isPro ? (
          <div className="p-5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">AI Analysis is a Pro feature</p>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
              Upgrade to Pro to unlock unlimited AI batch analysis, inventory management, and team access.
            </p>
            <Link href="/account">
              <Button size="sm" className="rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        ) : showUsage && remaining <= 0 ? (
          <div className="p-5 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <p className="text-sm font-semibold">AI analysis limit reached</p>
            </div>
            <p className="text-sm text-muted-foreground">
              You have used all {usage.limit} AI analyses this period. Your limit will reset with your next billing cycle.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={handleAnalyze}
              disabled={isPending}
              className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-600/20 h-12 text-base"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Brain className="mr-2 h-5 w-5" />
              )}
              {isPending ? "Analyzing..." : "Analyze Batches"}
            </Button>
            {showUsage && (
              <p className="text-xs text-center text-muted-foreground">
                {remaining} AI analysis{remaining !== 1 ? "s" : ""} remaining this period
              </p>
            )}
          </div>
        )}

        {latestResult && (
          <div className="space-y-3 p-5 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50 animate-scale-in">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              Latest Analysis
            </h4>
            {Array.isArray(latestResult.trends) && (latestResult.trends as string[]).length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Trends</p>
                {(latestResult.trends as string[]).map((t: string, i: number) => (
                  <p key={i} className="text-sm flex items-start gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                    {t}
                  </p>
                ))}
              </div>
            )}
            {Array.isArray(latestResult.outliers) && (latestResult.outliers as string[]).length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Outliers</p>
                {(latestResult.outliers as string[]).map((o: string, i: number) => (
                  <p key={i} className="text-sm flex items-start gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                    {o}
                  </p>
                ))}
              </div>
            )}
            <Separator className="bg-amber-200/30 dark:bg-amber-800/30" />
            <p className="text-sm leading-relaxed">{latestResult.summary}</p>
          </div>
        )}

        {recentAnalyses.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <History className="h-4 w-4" />
              Recent Analyses
            </h4>
            {recentAnalyses.slice(0, 3).map((a) => (
              <div key={a.id} className="p-3 rounded-xl border bg-muted/30 border-border/50 text-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{a.batch_count} batches analyzed</span>
                  <span>{new Date(a.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm line-clamp-2">{a.summary}</p>
              </div>
            ))}
            <Button variant="link" size="sm" className="text-amber-600 p-0" onClick={() => router.push("/analysis")}>
              View full history →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

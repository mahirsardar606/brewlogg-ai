import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BatchList } from "@/components/batches/BatchList";
import { AnalyzeSection } from "@/components/analysis/AnalyzeSection";
import { Beer, TrendingUp, AlertTriangle } from "lucide-react";
import type { Batch, BatchAnalysis } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("brewery_id, plan_tier, role")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileRaw ?? null;
  if (!profile) {
    redirect("/login");
  }

  const isFree = profile.plan_tier === "free";

  let memberIds: string[] = [user.id];
  if (profile?.brewery_id) {
    const { data: members } = await supabase
      .from("profiles").select("id").eq("brewery_id", profile.brewery_id);
    memberIds = (members ?? []).map((m: { id: string }) => m.id);
  }

  const { data: batchesRaw } = await supabase
    .from("batches").select("*").in("user_id", memberIds)
    .order("date", { ascending: false }).order("created_at", { ascending: false });

  const batches = (batchesRaw ?? []) as Batch[];

  const isOwner = profile?.role === "owner";
  const ownerMemberIds = isFree && isOwner ? memberIds : [user.id];
  const { count } = await supabase
    .from("batches").select("*", { count: "exact", head: true }).in("user_id", ownerMemberIds);

  const batchCount = batches.length;
  const limitReached = isFree && isOwner && (count ?? 0) >= 2;

  // Stats
  const avgOg = batches.filter(b => b.og).reduce((s, b) => s + (b.og ?? 0), 0) / Math.max(batches.filter(b => b.og).length, 1);
  const avgAbv = batches.filter(b => b.abv).reduce((s, b) => s + (b.abv ?? 0), 0) / Math.max(batches.filter(b => b.abv).length, 1);
  const recentAbv = batches.slice(0, 3).filter(b => b.abv).map(b => b.abv);
  const trend = recentAbv.length >= 2 && recentAbv[0]! > recentAbv[recentAbv.length - 1]! ? "up" : recentAbv.length >= 2 && recentAbv[0]! < recentAbv[recentAbv.length - 1]! ? "down" : null;

  let recentAnalyses: BatchAnalysis[] = [];
  if (profile?.brewery_id) {
    const { data: analysesRaw } = await supabase
      .from("batch_analyses").select("*").eq("brewery_id", profile.brewery_id)
      .order("created_at", { ascending: false }).limit(5);
    recentAnalyses = (analysesRaw ?? []) as BatchAnalysis[];
  }

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Beer className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {batchCount} batch{batchCount !== 1 ? "es" : ""} logged
              {isFree && isOwner ? ` - ${2 - (count ?? 0)} of 2 trial batches remaining` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {batchCount > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat-card group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Beer className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">Total</span>
              </div>
              <p className="text-3xl font-bold">{batchCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Batches logged</p>
            </div>
          </div>
          <div className="stat-card group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">Average</span>
              </div>
              <p className="text-3xl font-bold">{avgOg > 0 ? avgOg.toFixed(3) : "-"}</p>
              <p className="text-xs text-muted-foreground mt-1">Original Gravity</p>
            </div>
          </div>
          <div className="stat-card group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-800/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">Average</span>
              </div>
              <p className="text-3xl font-bold">{avgAbv > 0 ? `${avgAbv.toFixed(1)}%` : "-"}</p>
              <p className="text-xs text-muted-foreground mt-1">ABV</p>
            </div>
          </div>
          <div className="stat-card group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">Trend</span>
              </div>
              <p className={`text-3xl font-bold flex items-center gap-2 ${trend === "up" ? "text-green-600" : trend === "down" ? "text-amber-600" : ""}`}>
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
                <span className="text-sm font-medium text-muted-foreground">{trend === "up" ? "Rising" : trend === "down" ? "Dropping" : "Stable"}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">ABV Trend</p>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Banner */}
      {limitReached && (
        <div className="mb-8 p-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:border-amber-800 dark:from-amber-950/50 dark:to-orange-950/50 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                You have used your 2 free trial batches.
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                Upgrade to Pro for unlimited batch logging.
              </p>
            </div>
            <Link href="/account">
              <Button size="sm" className="rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg">
                Upgrade
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Batch List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Batches</h2>
        </div>
        <BatchList batches={batches} />
      </section>

      {/* Analysis */}
      <AnalyzeSection batchCount={batchCount} recentAnalyses={recentAnalyses} />
    </div>
  );
}

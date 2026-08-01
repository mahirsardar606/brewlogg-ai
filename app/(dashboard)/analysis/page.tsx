import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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
import { Brain, TrendingUp, ArrowLeft, History } from "lucide-react";
import type { BatchAnalysis } from "@/types";

export default async function AnalysisHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("brewery_id")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileRaw as { brewery_id: string } | null;
  if (!profile?.brewery_id) redirect("/dashboard");

  const { data: analysesRaw } = await supabase
    .from("batch_analyses")
    .select("*")
    .eq("brewery_id", profile.brewery_id)
    .order("created_at", { ascending: false });

  const analyses = (analysesRaw ?? []) as BatchAnalysis[];

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
          <h1 className="text-2xl font-bold mt-2">Analysis History</h1>
          <p className="text-sm text-muted-foreground">
            {analyses.length} analysis{analyses.length !== 1 ? "es" : ""} run
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <Brain className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </Link>
      </div>

      {analyses.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="text-6xl">??</div>
          <h3 className="text-lg font-semibold">No analyses yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Go to the dashboard and run your first analysis once you have at
            least 5 batches logged.
          </p>
          <Link href="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map((a) => {
            const trends = a.trends as string[] | null;
            return (
              <Card key={a.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <History className="h-4 w-4 text-amber-600" />
                      Analysis - {new Date(a.created_at).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {a.batch_count} batches
                    </span>
                  </div>
                  <CardDescription>AI analysis of batch trends and patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trends && trends.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Trends
                      </p>
                      <ul className="space-y-1">
                        {trends.map((t: string, i: number) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <TrendingUp className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator />

                  <p className="text-sm leading-relaxed">{a.summary}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

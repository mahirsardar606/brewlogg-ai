"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const AI_API_KEY = process.env.AI_API_KEY;
const AI_API_URL = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini";

export async function getAnalysisHistory(breweryId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: raw } = await supabase
    .from("batch_analyses")
    .select("*")
    .eq("brewery_id", breweryId)
    .order("created_at", { ascending: false })
    .limit(10);

  return (raw ?? []) as Record<string, unknown>[];
}

export async function runBatchAnalysis(): Promise<{
  success: boolean;
  message?: string;
  analysis?: Record<string, unknown>;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Not authenticated" };

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("brewery_id, plan_tier, ai_analyses_used, ai_limit")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileRaw as { brewery_id: string; plan_tier: string; ai_analyses_used: number; ai_limit: number } | null;
  if (!profile?.brewery_id) return { success: false, message: "Brewery not configured" };

  if (profile.plan_tier !== "pro") {
    return { success: false, message: "AI analysis is a Pro feature. Upgrade to unlock unlimited batch analysis." };
  }

  if (profile.ai_limit > 0 && profile.ai_analyses_used >= profile.ai_limit) {
    return { success: false, message: "You have reached your AI analysis limit for this period." };
  }

  // Get all brewery members
  const { data: members } = await supabase
    .from("profiles")
    .select("id")
    .eq("brewery_id", profile.brewery_id);

  const memberIds = (members ?? []).map((m: { id: string }) => m.id);

  // Fetch all batches (ordered by date ascending for trend analysis)
  const { data: batchesRaw } = await supabase
    .from("batches")
    .select("beer_name, date, batch_number, og, fg, abv")
    .in("user_id", memberIds)
    .order("date", { ascending: true })
    .order("created_at", { ascending: true });

  const batches = batchesRaw ?? [];

  if (batches.length < 5) {
    return {
      success: false,
      message: `Need at least 5 batches for analysis. You have ${batches.length}.`,
    };
  }

  // Build the prompt with batch data
  const batchDataText = batches
    .map(
      (b: Record<string, unknown>) =>
        `Batch #${b.batch_number} "${b.beer_name}" (${(b.date as string).slice(0, 10)}): OG=${b.og ?? "—"}, FG=${b.fg ?? "—"}, ABV=${b.abv ?? "—"}%`
    )
    .join("\n");

  const prompt = `You are a brewing data analyst. Analyze the following batch data from a craft brewery and return your analysis as valid JSON with exactly three keys:

1. "trends": an array of 2-4 strings describing consistency trends in OG, FG, and ABV across batches (e.g. "OG has been trending higher over the last 5 batches")
2. "outliers": an array of 0-3 strings identifying any notable outliers (e.g. "Batch #14 had an unusually low FG of 1.002, suggesting over-attenuation")
3. "summary": a single plain-language paragraph (2-4 sentences) summarizing the overall brewing pattern, calling out any actionable observations

Focus only on the numeric data provided — OG, FG, ABV values and their trends over time. Do not give general brewing advice. Do not suggest specific ingredients or processes unless the data clearly supports it. If there are no clear trends or outliers, state that honestly.

Batch data:
${batchDataText}

Return ONLY valid JSON with the three keys. No markdown formatting, no code fences.`;

  if (!AI_API_KEY) {
    return { success: false, message: "AI API key not configured. Set AI_API_KEY in environment." };
  }

  try {
    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      return { success: false, message: `AI API error (${response.status}): ${errBody.slice(0, 200)}` };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return { success: false, message: "AI returned empty response" };

    // Parse the JSON response
    let parsed: Record<string, unknown>;
    try {
      // Try to extract JSON if wrapped in markdown fences
      const cleaned = content.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // If parsing fails, store raw response and create a structured version
      parsed = {
        trends: [],
        outliers: [],
        summary: content.slice(0, 500),
      };
    }

    const summary = (parsed.summary as string) || content.slice(0, 500);
    const trends = parsed.trends || [];

    // Store the analysis
    const { error } = await supabase.from("batch_analyses").insert({
      brewery_id: profile.brewery_id,
      triggered_by: user.id,
      batch_count: batches.length,
      summary,
      trends: trends,
      raw_response: content,
    } as never);

    if (error) return { success: false, message: error.message };

    // Increment AI usage counter
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ ai_analyses_used: profile.ai_analyses_used + 1 } as never)
      .eq("id", user.id);

    if (updateError) return { success: false, message: updateError.message };

    revalidatePath("/dashboard");
    revalidatePath("/analysis");

    return {
      success: true,
      message: "Analysis complete",
      analysis: { summary, trends: parsed.trends, outliers: parsed.outliers },
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Analysis failed",
    };
  }
}

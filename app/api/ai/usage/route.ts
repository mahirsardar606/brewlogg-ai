import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("plan_tier, ai_analyses_used, ai_limit")
    .eq("id", user.id)
    .single();

  const profile = profileRaw as { plan_tier: string; ai_analyses_used: number; ai_limit: number } | null;

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({
    plan: profile.plan_tier,
    used: profile.ai_analyses_used,
    limit: profile.ai_limit,
  });
}

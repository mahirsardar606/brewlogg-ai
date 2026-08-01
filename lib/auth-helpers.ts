import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireProfile() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}

export async function checkBatchLimit(): Promise<{
  allowed: boolean;
  current: number;
  limit: number;
}> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan_tier")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.plan_tier === "pro") {
    return { allowed: true, current: 0, limit: Infinity };
  }

  const { count } = await supabase
    .from("batches")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const current = count ?? 0;
  return { allowed: current < 5, current, limit: 5 };
}


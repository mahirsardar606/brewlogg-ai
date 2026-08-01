"use server";

import { createClient } from "@/lib/supabase/server";

export async function logAudit(actorId: string, action: string, metadata: Record<string, unknown> = {}) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({
    actor_id: actorId,
    action,
    metadata,
  });
}

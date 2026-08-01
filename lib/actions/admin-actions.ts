"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logAudit } from "@/lib/actions/audit-actions";

export async function approveUser(userId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  await supabase.from("profiles").update({
    approval_status: "approved",
  }).eq("id", userId);

  await logAudit(user.id, "user.approve", { targetId: userId });
}

export async function rejectUser(userId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  await supabase.from("profiles").update({
    approval_status: "rejected",
  }).eq("id", userId);

  await logAudit(user.id, "user.reject", { targetId: userId });
}

export async function approveVerification(verificationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: verification } = await supabase.from("verifications").select("user_id").eq("id", verificationId).single();

  await supabase.from("verifications").update({
    status: "approved",
    reviewed_at: new Date().toISOString(),
    reviewed_by: user.id,
  }).eq("id", verificationId);

  if (verification) {
    await supabase.from("profiles").update({
      verification_status: "approved",
    }).eq("id", verification.user_id);
  }

  await logAudit(user.id, "verification.approve", { targetId: verificationId });
}

export async function rejectVerification(verificationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: verification } = await supabase.from("verifications").select("user_id").eq("id", verificationId).single();

  await supabase.from("verifications").update({
    status: "rejected",
    reviewed_at: new Date().toISOString(),
    reviewed_by: user.id,
  }).eq("id", verificationId);

  if (verification) {
    await supabase.from("profiles").update({
      verification_status: "rejected",
    }).eq("id", verification.user_id);
  }

  await logAudit(user.id, "verification.reject", { targetId: verificationId });
}

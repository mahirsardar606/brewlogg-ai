"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return profile as Record<string, unknown> | null;
}

export async function getBreweryMembers() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Get current user's brewery_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("brewery_id, role")
    .eq("id", user.id)
    .maybeSingle();

  const breweryId = (profile as { brewery_id: string } | null)?.brewery_id;
  if (!breweryId) return [];

  // Get all members of this brewery
  const { data: members } = await supabase
    .from("profiles")
    .select("*")
    .eq("brewery_id", breweryId)
    .order("created_at", { ascending: true });

  return (members ?? []) as Record<string, unknown>[];
}

export async function inviteBrewer(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { success: false, message: "Email is required" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Not authenticated" };

  // Verify the current user is an owner
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, brewery_id")
    .eq("id", user.id)
    .maybeSingle();

  const currentProfile = profile as { role: string; brewery_id: string } | null;
  if (!currentProfile || currentProfile.role !== "owner") {
    return { success: false, message: "Only the brewery owner can invite members" };
  }

  if (!currentProfile.brewery_id) {
    return { success: false, message: "Brewery not configured" };
  }

  // Use admin client to invite via Supabase Auth
  try {
    const adminClient = createAdminClient();
    const { error } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: {
        role: "brewer",
        brewery_id: currentProfile.brewery_id,
        invited_by: user.id,
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath("/team");
    return { success: true, message: `Invitation sent to ${email}` };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to send invitation",
    };
  }
}

export async function removeTeamMember(memberId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Not authenticated" };

  // Verify the current user is an owner
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const currentProfile = profile as { role: string } | null;
  if (!currentProfile || currentProfile.role !== "owner") {
    return { success: false, message: "Only the brewery owner can remove members" };
  }

  // Cannot remove yourself (the owner)
  if (memberId === user.id) {
    return { success: false, message: "You cannot remove yourself" };
  }

  // Get the member's auth user id and delete their auth user
  // (cascade will remove their profile and data)
  try {
    const adminClient = createAdminClient();
    const { error } = await adminClient.auth.admin.deleteUser(memberId);

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath("/team");
    return { success: true, message: "Team member removed" };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to remove member",
    };
  }
}
